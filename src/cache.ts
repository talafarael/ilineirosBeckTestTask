const cache = require( "memory-cache")

function setTempData(key: string, data: any, ttlMilliseconds: number): void {
	cache.put(key, data, ttlMilliseconds)
}

function getTempData(key: string): any {
	return cache.get(key)
}

function removeTempData(key: string): void {
	cache.del(key)
}

export {setTempData, getTempData, removeTempData}

