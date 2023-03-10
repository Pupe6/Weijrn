import SwipeListItem from "./swipe-list-item";
import SwipeListHiddenItem from "./swipe-list-hidden-item";
import { onRowDidOpen } from "../utils/swipe-list";
import { SwipeListView } from "react-native-swipe-list-view";
import { Box } from "native-base";

export default function SwipeList({ tags }) {
	return (
		<Box bg="white" safeArea flex="1">
			<SwipeListView
				data={tags}
				renderItem={tag => (
					<SwipeListItem tag={tag.item} index={tag.item._id} />
				)}
				renderHiddenItem={tag => (
					<SwipeListHiddenItem tag={tag.item} id={tag.item._id} />
				)}
				rightOpenValue={-130}
				previewRowKey={"0"}
				previewOpenValue={-40}
				previewOpenDelay={3000}
				onRowDidOpen={(rowKey, rowMap) => {
					console.log(rowKey, rowMap);
					onRowDidOpen(rowKey);
				}}
			/>
		</Box>
	);
}
