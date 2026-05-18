#!/usr/bin/env python3
"""
Generate JSON files from Obsidian Markdown articles and books.
Outputs data/articles.json and data/books.json for the blog.

This script:
- Validates frontmatter structure
- Provides clear error messages
- Handles missing/invalid data gracefully
- Exits with proper codes for CI/CD
"""

import os
import re
import json
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple

# Try to use pyyaml if available, otherwise use simple parser
try:
    import yaml
    USE_YAML = True
except ImportError:
    USE_YAML = False

# Required fields for articles and books
REQUIRED_ARTICLE_FIELDS = ['title', 'url']
REQUIRED_BOOK_FIELDS = ['title', 'author']

# Track errors and warnings
errors: List[str] = []
warnings: List[str] = []


def log_error(message: str, file_path: Optional[Path] = None) -> None:
    """Log an error message."""
    error_msg = f"ERROR: {message}"
    if file_path:
        error_msg += f" (in {file_path})"
    errors.append(error_msg)
    print(error_msg, file=sys.stderr)


def log_warning(message: str, file_path: Optional[Path] = None) -> None:
    """Log a warning message."""
    warning_msg = f"WARNING: {message}"
    if file_path:
        warning_msg += f" (in {file_path})"
    warnings.append(warning_msg)
    print(warning_msg, file=sys.stderr)


def parse_yaml_frontmatter(frontmatter_str: str) -> Dict[str, Any]:
    """Parse YAML frontmatter - uses pyyaml if available, otherwise simple parser."""
    if USE_YAML:
        try:
            parsed = yaml.safe_load(frontmatter_str)
            return parsed if parsed is not None else {}
        except yaml.YAMLError as e:
            log_warning(f"YAML parsing error: {e}, falling back to simple parser")
    
    # Fallback: Simple YAML parser (no external dependencies)
    data: Dict[str, Any] = {}
    current_key: Optional[str] = None
    current_value: List[str] = []
    in_list = False
    
    for line in frontmatter_str.split('\n'):
        line = line.strip()
        if not line:
            continue
        
        # Handle list items
        if line.startswith('- '):
            if current_key:
                if current_key not in data:
                    data[current_key] = []
                # Remove quotes if present
                value = line[2:].strip().strip("'\"")
                data[current_key].append(value)
            in_list = True
            continue
        elif in_list and not line.startswith('-'):
            in_list = False
        
        # Handle key-value pairs
        if ':' in line:
            if current_key and current_value:
                data[current_key] = ' '.join(current_value).strip().strip("'\"")
                current_value = []
            
            parts = line.split(':', 1)
            current_key = parts[0].strip()
            value = parts[1].strip() if len(parts) > 1 else ''
            
            if value:
                if value.startswith('[') and value.endswith(']'):
                    # Array format: tags: ['Tech', 'Rails']
                    value = value.strip('[]')
                    data[current_key] = [v.strip().strip("'\"") for v in value.split(',') if v.strip()]
                    current_key = None
                else:
                    data[current_key] = value.strip("'\"")
                    current_key = None
            else:
                current_value = []
        elif current_key:
            current_value.append(line)
    
    if current_key and current_value:
        data[current_key] = ' '.join(current_value).strip().strip("'\"")
    
    return data


def extract_frontmatter(content: str) -> Tuple[Dict[str, Any], str]:
    """Extract YAML frontmatter from Markdown file."""
    frontmatter_pattern = r'^---\s*\n(.*?)\n---\s*\n(.*)$'
    match = re.match(frontmatter_pattern, content, re.DOTALL)
    
    if match:
        frontmatter_str = match.group(1)
        body = match.group(2)
        frontmatter = parse_yaml_frontmatter(frontmatter_str)
        return frontmatter, body
    return {}, content


def validate_article(article: Dict[str, Any], file_path: Path) -> bool:
    """Validate article data structure."""
    is_valid = True
    
    for field in REQUIRED_ARTICLE_FIELDS:
        if not article.get(field):
            log_error(f"Missing required field: {field}", file_path)
            is_valid = False
    
    # Validate URL format if present
    url = article.get('url', '')
    if url and not (url.startswith('http://') or url.startswith('https://')):
        log_warning(f"URL doesn't start with http:// or https://: {url}", file_path)
    
    # Validate date format (basic check)
    date = article.get('date', '')
    if date and len(date) < 4:
        log_warning(f"Date format seems invalid: {date}", file_path)
    
    # Validate tags is a list
    tags = article.get('tags', [])
    if tags and not isinstance(tags, list):
        log_warning(f"Tags should be a list, got {type(tags)}", file_path)
        article['tags'] = []
    
    return is_valid


def validate_book(book: Dict[str, Any], file_path: Path) -> bool:
    """Validate book data structure."""
    is_valid = True
    
    for field in REQUIRED_BOOK_FIELDS:
        if not book.get(field):
            log_error(f"Missing required field: {field}", file_path)
            is_valid = False
    
    # Validate rating if present
    rating = book.get('rating')
    if rating is not None:
        try:
            rating_num = float(rating)
            if rating_num < 0 or rating_num > 5:
                log_warning(f"Rating should be between 0-5, got {rating_num}", file_path)
        except (ValueError, TypeError):
            log_warning(f"Rating should be a number, got {type(rating)}", file_path)
            book['rating'] = None
    
    # Validate tags is a list
    tags = book.get('tags', [])
    if tags and not isinstance(tags, list):
        log_warning(f"Tags should be a list, got {type(tags)}", file_path)
        book['tags'] = []
    
    return is_valid


def get_articles() -> List[Dict[str, Any]]:
    """Collect all published articles from articles/YYYY/published/ folders."""
    articles: List[Dict[str, Any]] = []
    articles_dir = Path('articles')
    
    if not articles_dir.exists():
        log_warning("Articles directory not found, skipping articles")
        return articles
    
    processed_count = 0
    skipped_count = 0
    
    # Find all published articles
    for year_dir in articles_dir.iterdir():
        if not year_dir.is_dir():
            continue
        
        published_dir = year_dir / 'published'
        if not published_dir.exists():
            continue
        
        for md_file in published_dir.glob('*.md'):
            processed_count += 1
            try:
                content = md_file.read_text(encoding='utf-8')
                frontmatter, body = extract_frontmatter(content)
                
                # Only include if status is published (or if url exists)
                status = frontmatter.get('status', '').lower()
                has_url = bool(frontmatter.get('url'))

                # Skip articles destined for Synergym only
                if (frontmatter.get('blog') or '').strip().lower() == 'synergym':
                    continue

                if status == 'published' or has_url:
                    article = {
                        'title': frontmatter.get('title', '').strip(),
                        'date': frontmatter.get('date', '').strip(),
                        'description': frontmatter.get('description', '').strip(),
                        'url': frontmatter.get('url', '').strip(),
                        'thumbnail': frontmatter.get('thumbnail', '').strip(),
                        'tags': frontmatter.get('tags', []) if isinstance(frontmatter.get('tags'), list) else []
                    }
                    
                    if validate_article(article, md_file):
                        articles.append(article)
                    else:
                        skipped_count += 1
                else:
                    skipped_count += 1
                    log_warning(f"Article skipped (status='{status}', has_url={has_url})", md_file)
            except Exception as e:
                skipped_count += 1
                log_error(f"Failed to process article: {e}", md_file)
                continue
    
    # Sort by date (newest first)
    articles.sort(key=lambda x: x.get('date', ''), reverse=True)
    
    print(f"Processed {processed_count} article files, {len(articles)} published, {skipped_count} skipped")
    return articles


def get_books() -> List[Dict[str, Any]]:
    """Collect all books from books/ directory or books/YYYY/published/ folders."""
    books: List[Dict[str, Any]] = []
    books_dir = Path('books')
    
    if not books_dir.exists():
        log_warning("Books directory not found, skipping books")
        return books
    
    processed_count = 0
    skipped_count = 0
    
    # Try structured format first: books/YYYY/published/
    structured_found = False
    for year_dir in books_dir.iterdir():
        if not year_dir.is_dir():
            continue
        
        published_dir = year_dir / 'published'
        if published_dir.exists():
            structured_found = True
            for md_file in published_dir.glob('*.md'):
                processed_count += 1
                try:
                    content = md_file.read_text(encoding='utf-8')
                    frontmatter, body = extract_frontmatter(content)
                    
                    # Only include if status is published or if no status field exists
                    status = frontmatter.get('status', '').lower()
                    if status == 'published' or 'status' not in frontmatter:
                        book = {
                            'title': frontmatter.get('title', '').strip(),
                            'author': frontmatter.get('author', '').strip(),
                            'rating': frontmatter.get('rating', None),
                            'tags': frontmatter.get('tags', []) if isinstance(frontmatter.get('tags'), list) else [],
                            'cover': frontmatter.get('cover', '').strip(),
                            'lesson': (frontmatter.get('lesson', '') or 
                                     frontmatter.get('what_i_learned', '') or 
                                     frontmatter.get('learned', '')).strip(),
                            'date': (frontmatter.get('date', '') or 
                                   frontmatter.get('finished_date', '') or 
                                   frontmatter.get('finished', '')).strip(),
                        }
                        
                        if validate_book(book, md_file):
                            books.append(book)
                        else:
                            skipped_count += 1
                    else:
                        skipped_count += 1
                        log_warning(f"Book skipped (status='{status}')", md_file)
                except Exception as e:
                    skipped_count += 1
                    log_error(f"Failed to process book: {e}", md_file)
                    continue
    
    # If no structured format found, try flat books/ directory
    if not structured_found:
        for md_file in books_dir.glob('*.md'):
            processed_count += 1
            try:
                content = md_file.read_text(encoding='utf-8')
                frontmatter, body = extract_frontmatter(content)
                
                # Only include if status is published or if no status field exists
                status = frontmatter.get('status', '').lower()
                if status == 'published' or 'status' not in frontmatter:
                    book = {
                        'title': frontmatter.get('title', '').strip(),
                        'author': frontmatter.get('author', '').strip(),
                        'rating': frontmatter.get('rating', None),
                        'tags': frontmatter.get('tags', []) if isinstance(frontmatter.get('tags'), list) else [],
                        'cover': frontmatter.get('cover', '').strip(),
                        'lesson': (frontmatter.get('lesson', '') or 
                                 frontmatter.get('what_i_learned', '') or 
                                 frontmatter.get('learned', '')).strip(),
                        'date': (frontmatter.get('date', '') or 
                               frontmatter.get('finished_date', '') or 
                               frontmatter.get('finished', '')).strip(),
                    }
                    
                    if validate_book(book, md_file):
                        books.append(book)
                    else:
                        skipped_count += 1
                else:
                    skipped_count += 1
                    log_warning(f"Book skipped (status='{status}')", md_file)
            except Exception as e:
                skipped_count += 1
                log_error(f"Failed to process book: {e}", md_file)
                continue
    
    # Sort by rating (highest first), then by date (newest first)
    books.sort(key=lambda x: (
        -(x.get('rating') or 0),
        x.get('date', '')
    ), reverse=True)
    
    print(f"Processed {processed_count} book files, {len(books)} published, {skipped_count} skipped")
    return books


def main() -> int:
    """Generate JSON files. Returns exit code (0 = success, 1 = error)."""
    global errors, warnings
    
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Generate articles.json
    print("\n=== Generating articles.json ===")
    articles = get_articles()
    
    try:
        with open('data/articles.json', 'w', encoding='utf-8') as f:
            json.dump(articles, f, ensure_ascii=False, indent=2)
        print(f"✓ Generated data/articles.json with {len(articles)} articles")
        for article in articles[:5]:  # Show first 5
            print(f"  - {article.get('title', 'Untitled')} ({article.get('date', 'no date')})")
        if len(articles) > 5:
            print(f"  ... and {len(articles) - 5} more")
    except Exception as e:
        log_error(f"Failed to write articles.json: {e}")
        return 1
    
    # Generate books.json
    print("\n=== Generating books.json ===")
    books = get_books()
    
    try:
        with open('data/books.json', 'w', encoding='utf-8') as f:
            json.dump(books, f, ensure_ascii=False, indent=2)
        print(f"✓ Generated data/books.json with {len(books)} books")
        for book in books[:5]:  # Show first 5
            rating = book.get('rating', 'N/A')
            print(f"  - {book.get('title', 'Untitled')} by {book.get('author', 'Unknown')} (Rating: {rating})")
        if len(books) > 5:
            print(f"  ... and {len(books) - 5} more")
    except Exception as e:
        log_error(f"Failed to write books.json: {e}")
        return 1
    
    # Print summary
    print("\n=== Summary ===")
    if warnings:
        print(f"\n⚠ {len(warnings)} warning(s):")
        for warning in warnings[:10]:  # Show first 10 warnings
            print(f"  {warning}")
        if len(warnings) > 10:
            print(f"  ... and {len(warnings) - 10} more warnings")
    
    if errors:
        print(f"\n✗ {len(errors)} error(s):")
        for error in errors:
            print(f"  {error}")
        print("\n⚠ Generation completed with errors. Please review the errors above.")
        return 1
    
    if not warnings and not errors:
        print("✓ All files generated successfully with no errors or warnings!")
    
    return 0


if __name__ == '__main__':
    exit_code = main()
    sys.exit(exit_code)
