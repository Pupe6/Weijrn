import { Center, Image } from "native-base";
import { baseUrl } from "../utils/requester";

export default function Loading() {
	return (
		<Center
			bg="rgba(0,0,0,0.5)"
			position="absolute"
			top={0}
			left={0}
			right={0}
			bottom={0}
			zIndex={1000}>
			<Image
				source={{ uri: `${baseUrl}/loading` }}
				alt="Loading..."
				width="50%"
				height="50%"
				resizeMode="contain"
			/>
		</Center>
	);
}
