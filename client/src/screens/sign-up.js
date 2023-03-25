import React, { useContext, useEffect } from "react";
import {
	FormControl,
	Input,
	VStack,
	Center,
	Box,
	Heading,
	Button,
	HStack,
	Text,
	useColorModeValue,
} from "native-base";
import { useFormValidation } from "../hooks/useFormValidation";
import { validateSignUpForm } from "../utils/validation";
import { AuthContext } from "../contexts/authContext";

export default function SignUpScreen({ navigation }) {
	const { values, errors, isSubmitting, handleChange, handleSubmit } =
		useFormValidation(
			{
				username: "",
				email: "",
				password: "",
				confirmPassword: "",
				macAddress: "",
			},
			validateSignUpForm
		);
	const bg = useColorModeValue("white", "coolGray.800");
	const textColor = useColorModeValue("coolGray.800", "warmGray.50");
	const { register } = useContext(AuthContext);

	useEffect(() => {
		if (isSubmitting && Object.values(errors).some(error => !error)) {
			register(values).catch(console.error);
		}
	}, [isSubmitting]);

	return (
		<Box flex="1" safeArea bg={bg}>
			<Center w="100%">
				<Box safeArea p="2" w="90%" maxW="290" py="8">
					<Heading
						size="lg"
						color="coolGray.800"
						_dark={{
							color: "warmGray.50",
						}}
						fontWeight="semibold">
						Welcome
					</Heading>
					<Heading
						mt="1"
						color="coolGray.600"
						_dark={{
							color: "warmGray.200",
						}}
						fontWeight="medium"
						size="xs">
						Sign up to continue!
					</Heading>
					<VStack space={3} mt="5">
						<FormControl isInvalid={errors?.username}>
							<FormControl.Label>Username</FormControl.Label>
							<Input
								onChangeText={text =>
									handleChange("username", text)
								}
							/>

							<FormControl.ErrorMessage>
								{errors?.username}
							</FormControl.ErrorMessage>
						</FormControl>
						<FormControl isInvalid={errors?.email}>
							<FormControl.Label>Email</FormControl.Label>
							<Input
								onChangeText={text =>
									handleChange("email", text)
								}
							/>

							<FormControl.ErrorMessage>
								{errors?.email}
							</FormControl.ErrorMessage>
						</FormControl>
						<FormControl isInvalid={errors?.password}>
							<FormControl.Label>Password</FormControl.Label>
							<Input
								type="password"
								onChangeText={text =>
									handleChange("password", text)
								}
							/>

							<FormControl.ErrorMessage>
								{errors?.password}
							</FormControl.ErrorMessage>
						</FormControl>
						<FormControl isInvalid={errors?.confirmPassword}>
							<FormControl.Label>
								Confirm Password
							</FormControl.Label>
							<Input
								type="password"
								onChangeText={text =>
									handleChange("confirmPassword", text)
								}
							/>

							<FormControl.ErrorMessage>
								{errors?.confirmPassword}
							</FormControl.ErrorMessage>
						</FormControl>
						<FormControl isInvalid={errors?.macAddress}>
							<FormControl.Label>Mac Address</FormControl.Label>
							<Input
								onChangeText={text => {
									const strippedMac = text
										.replace(/^a-zA-Z0-9]/g, ":")
										.trim();
									handleChange("macAddress", strippedMac);
								}}
							/>

							<FormControl.ErrorMessage>
								{errors?.macAddress}
							</FormControl.ErrorMessage>
						</FormControl>
						<Button
							mt="2"
							colorScheme="indigo"
							onPress={handleSubmit}
							_disabled={isSubmitting}>
							Sign up
						</Button>
						<HStack
							mt="6"
							alignItems="center"
							justifyContent="center">
							<Text
								fontSize="sm"
								color="coolGray.800"
								_dark={{
									color: "warmGray.50",
								}}
								fontWeight={400}>
								Already have an account?{" "}
							</Text>
							<Button
								variant="link"
								onPress={() => {
									navigation.goBack();
								}}>
								<Text
									fontWeight="bold"
									color="indigo.500"
									underline
									_dark={{
										color: "indigo.300",
									}}>
									Sign In
								</Text>
							</Button>
						</HStack>
					</VStack>
				</Box>
			</Center>
		</Box>
	);
}
