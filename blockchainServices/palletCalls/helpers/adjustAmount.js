const adjustAmount = async (api, assetId, amount) => {
	const metadata = await api.query.assets.metadata(assetId)
	return amount *  (1 * (10 ** metadata.decimals))
}


module.exports = {
	adjustAmount
}