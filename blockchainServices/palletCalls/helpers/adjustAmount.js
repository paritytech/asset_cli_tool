const adjustAmount = async (api, assetId, amount) => {
	const metadata = await api.query.assets.metadata(assetId)
	return metadata.decimals ? amount *  (1 * (10 ** metadata.decimals)) : amount
}


module.exports = {
	adjustAmount
}
