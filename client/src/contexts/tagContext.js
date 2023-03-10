import { createContext } from "react";
import {
	getTags,
	getTag,
	createTag,
	updateTag,
	deleteTag,
} from "../services/tagService";

export const TagContext = createContext({
	getTags: () => {},
	getTag: (nickname, macAddress) => {},
	createTag: (nickname, token, macAddress) => {},
	updateTag: (nickname, token) => {},
	deleteTag: (nickname, token) => {},
});

export const TagProvider = ({ children }) => {
	return (
		<TagContext.Provider
			value={{
				getTags,
				getTag,
				createTag,
				updateTag,
				deleteTag,
			}}>
			{children}
		</TagContext.Provider>
	);
};
