import { createContext, useContext } from "react";

// Lets the navbar's persistent mark know when the full-page intro has
// handed off to it, so it only mounts (and claims the shared layoutId)
// once the intro is actually flying the mark toward it.
export const BrandIntroContext = createContext({ markLanded: true });

export const useBrandIntro = () => useContext(BrandIntroContext);
