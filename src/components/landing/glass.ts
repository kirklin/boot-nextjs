/** Frosted surface for controls that float on a tile's scene. */
export const glass = "bg-white/70 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_10px_28px_-10px_rgb(0_0_0/0.2)] backdrop-blur-xl dark:bg-white/[0.09] dark:shadow-[0_10px_28px_-10px_rgb(0_0_0/0.7)]";

/** Round glass button with a colored ring when it is the selected one. */
export const glassCircle = `${glass} flex size-13 items-center justify-center rounded-full transition-shadow duration-300 [&_svg]:size-[22px] [&_svg]:stroke-[1.75]`;

export const selectedRing = "ring-2 ring-brand ring-offset-2 ring-offset-transparent";
