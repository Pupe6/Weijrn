import * as React from "react";
import { FormControl, Input, Button, Text, VStack } from "native-base";
import ThemeToggle from "../components/common/theme-toggle";
import { useForm } from "../hooks/useForm";

export default function SignUpScreen() {
	return (
		<VStack space={2} alignItems="center" w={[300, 400, 500]} h="100%">
			<Text fontSize="4xl">Welcome to Weijrn!</Text>
			<FormControl isRequired>
				<FormControl.Label>Email address</FormControl.Label>
				<Input type="email" />
				<FormControl.HelperText>
					We'll never share your email.
				</FormControl.HelperText>
				<FormControl.ErrorMessage>
					We can't find your account.
				</FormControl.ErrorMessage>
			</FormControl>
		</VStack>
	);
}
