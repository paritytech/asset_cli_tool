const adjustAmount = async (api, assetId, amount) => {
	const metadata = await api.query.assets.metadata(assetId)
	const formatted = metadata.decimals ? amount *  (1 * (10 ** metadata.decimals)) : amount
	return formatted.toLocaleString('fullwide', {useGrouping:false});
}


module.exports = {
	adjustAmount
}
