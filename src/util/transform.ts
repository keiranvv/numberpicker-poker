export const calculateAngleBreakpoint = (count: number, minAngle: number, maxAngle: number): number => {
	const start = minAngle !== maxAngle ? Math.min(minAngle, maxAngle) : minAngle
	const end = minAngle !== maxAngle ? Math.max(minAngle, maxAngle) : maxAngle

	const diff = end - start

	const angle = diff / (count - 1)

	return angle
}

export const getCssAngle = (deg: number): number => {
	return deg - 90
}
