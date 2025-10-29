export function getRandomColor() {
    return `hsl(${Math.floor(Math.random() * 360)},100%,40%)`
}
const CACHE_COLORS: Map<string, string> = {}
export function getRandomColorByName(name: string): string {
    if (name in CACHE_COLORS) {
        return CACHE_COLORS[name] as string
    }
    const color = getRandomColor()
    CACHE_COLORS[name] = color
    return color
}
