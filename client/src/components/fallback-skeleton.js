import { Skeleton } from "native-base";

export default function FallbackSkeleton({ w, h }) {
	return (
		<Skeleton
			safeArea
			mt="3"
			justifyItems="center"
			alignSelf="center"
			width={w || "50vh"}
			height={h || "60vh"}
			rounded="lg"
			bg="warmGray.300"
			_dark={{
				bg: "coolGray.800",
			}}
		/>
	);
}
