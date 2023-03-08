import * as React from "react";
import {
	FormControl,
	Input,
	Box,
	Center,
	Heading,
	VStack,
	Link,
	Button,
	HStack,
} from "native-base";
import { useForm } from "../hooks/useForm";

export default function SignInScreen() {
	const [formState, formErrors, handleChange, handleSubmit] = useForm({});

	return (
		<Center w="100%">
			<Box safeArea p="2" py="8" w="90%" maxW="290">
				<Heading
					size="lg"
					fontWeight="600"
					color="coolGray.800"
					_dark={{
						color: "warmGray.50",
					}}>
					Welcome
				</Heading>
				<Heading
					mt="1"
					_dark={{
						color: "warmGray.200",
					}}
					color="coolGray.600"
					fontWeight="medium"
					size="xs">
					Sign in to continue!
				</Heading>

				<VStack space={3} mt="5">
					<FormControl>
						<FormControl.Label>Email</FormControl.Label>
						<Input
							onChangeText={text =>
								handleChange({ field: "email", value: text })
							}
						/>
						<FormControl.HelperText>
							We'll never share your email.
						</FormControl.HelperText>
						{formErrors.email && (
							<FormControl.ErrorMessage>
								{formErrors.email}
							</FormControl.ErrorMessage>
						)}
					</FormControl>
					<FormControl>
						<FormControl.Label>Password</FormControl.Label>
						<Input
							type="password"
							onChangeText={text =>
								handleChange({
									field: "password",
									value: text,
								})
							}
						/>
						{formErrors.password && (
							<FormControl.ErrorMessage>
								{formErrors.password}
							</FormControl.ErrorMessage>
						)}
						<Link
							_text={{
								fontSize: "xs",
								fontWeight: "500",
								color: "indigo.500",
							}}
							alignSelf="flex-end"
							mt="1">
							Forget Password?
						</Link>
					</FormControl>
					<Button
						mt="2"
						colorScheme="indigo"
						onPress={handleSubmit(formState)}>
						Sign in
					</Button>
					<HStack mt="6" justifyContent="center">
						<Text
							fontSize="sm"
							color="coolGray.600"
							_dark={{
								color: "warmGray.200",
							}}>
							I'm a new user.{" "}
						</Text>
						<Link
							_text={{
								color: "indigo.500",
								fontWeight: "medium",
								fontSize: "sm",
							}}
							href="#">
							Sign Up
						</Link>
					</HStack>
				</VStack>
			</Box>
		</Center>
	);
}
