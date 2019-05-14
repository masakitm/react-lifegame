export const isTop = (size, index) => index < size
export const isBottom = (size, index) => index <= size * size - 1 && index > size * size - size - 1;
export const isRight = (size, index) => index !== 0 && index % size === size - 1;
export const isLeft = (size, index) => index % size === 0
export const isLeftTop = (size, index) => isLeft(size, index) && isTop(size, index)
export const isRightTop = (size, index) => isRight(size, index) && isTop(size, index)
export const isLeftBottom = (size, index) => isLeft(size, index) && isBottom(size, index)
export const isRightBottom = (size, index) => isRight(size, index) && isBottom(size, index)

export const cellIndex = (size, index) => {
	return [
		index - size - 1,
		index - size,
		index - size + 1,
		index - 1,
		index,
		index + 1,
		index + size - 1,
		index + size,
		index + size + 1
	]
}

export const filterIndex = (arr, size, index) => {
	return cellIndex(size, index).filter((cell, index) => {
		return !arr.includes(index)
	})
}

export const createNeighbourIndex = (size, index) => {
	const top = [0,1,2]
	const left = [0,3,6]
	const right = [2,5,8]
	const bottom = [6,7,8]
	const center = [4]

	if (isLeftTop(size, index)) {
		return filterIndex([...top, ...left, ...center], size, index)
	}

	if (isRightTop(size, index)) {
		return filterIndex([...right, ...top, ...center], size, index)
	}

	if (isLeftBottom(size, index)) {
		return filterIndex([...left, ...bottom, ...center], size, index)
	}

	if (isRightBottom(size, index)) {
		return filterIndex([...right, ...bottom, ...center], size, index)
	}

	if (isTop(size, index)) {
		return filterIndex([...top, ...center], size, index)
	}

	if (isLeft(size, index)) {
		return filterIndex([...left, ...center], size, index)
	}

	if (isRight(size, index)) {
		return filterIndex([...right, ...center], size, index)
	}

	if (isBottom(size, index)) {
		return filterIndex([...bottom, ...center], size, index)
	}

	return filterIndex(center, size, index)
}