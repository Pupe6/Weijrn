export const closeRow = (rowMap, rowKey) => {
	if (rowMap[rowKey]) {
		rowMap[rowKey].closeRow();
	}
};

export const deleteRow = (rowMap, rowKey, setListData) => {
	closeRow(rowMap, rowKey);
	setListData(prevState => {
		const newData = [...prevState.data];
		const prevIndex = prevState.tags.findIndex(tag => tag._id === rowKey);
		newData.splice(prevIndex, 1);
		// set list data and update count in parent component
		return { count: newData.length, tags: newData };
	});
};

export const onRowDidOpen = rowKey => {
	console.log("This row opened", rowKey);
};
