export function motionSnapshot() {
  const style = getComputedStyle(document.documentElement);
  return [
    "--spring-stiffness",
    "--spring-damping",
    "--spring-mass",
    "--space-8",
  ]
    .map((name) => style.getPropertyValue(name))
    .concat(style.fontSize)
    .join("|");
}
export function parseMotionTokens(snapshot: string) {
  const [stiffness, damping, mass, distance = "", fontSize] =
    snapshot.split("|");
  return {
    stiffness: Number(stiffness) || 1,
    damping: Number(damping) || 1,
    mass: Number(mass) || 1,
    distance:
      (parseFloat(distance) || 0) *
      (distance.trim().endsWith("rem") ? parseFloat(fontSize) || 1 : 1),
  };
}
export const noMotionSubscription = () => () => {};
