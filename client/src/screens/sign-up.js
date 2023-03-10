import React, { useContext } from "react";
import {
	FormControl,
	Input,
	VStack,
	Center,
	Box,
	Heading,
	Button,
} from "native-base";
import { useFormValidation } from "../hooks/useFormValidation";
import { validateSignUpForm } from "../utils/validation";
import { AuthContext } from "../contexts/authContext";

export default function SignUpScreen() {
	const { values, errors, isSubmitting, handleChange, handleSubmit } =
		useFormValidation(
			{
				username: "",
				email: "",
				password: "",
				confirmPassword: "",
				macAdress: "",
			},
			validateSignUpForm
		);
	const { signUp } = useContext(AuthContext);
	return (
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
					<FormControl>
						<FormControl.Label>Username</FormControl.Label>
						<Input
							onChangeText={text =>
								handleChange("username", text)
							}
						/>
						{errors?.username && (
							<FormControl.ErrorMessage>
								{errors?.username}
							</FormControl.ErrorMessage>
						)}
					</FormControl>
					<FormControl>
						<FormControl.Label>Email</FormControl.Label>
						<Input
							onChangeText={text => handleChange("email", text)}
						/>
						{errors?.email && (
							<FormControl.ErrorMessage>
								{errors?.email}
							</FormControl.ErrorMessage>
						)}
					</FormControl>
					<FormControl>
						<FormControl.Label>Password</FormControl.Label>
						<Input
							type="password"
							onChangeText={text =>
								handleChange("password", text)
							}
						/>
						{errors?.password && (
							<FormControl.ErrorMessage>
								{errors?.password}
							</FormControl.ErrorMessage>
						)}
					</FormControl>
					<FormControl>
						<FormControl.Label>Confirm Password</FormControl.Label>
						<Input
							type="password"
							onChangeText={text =>
								handleChange("confirmPassword", text)
							}
						/>
						{errors?.confirmPassword && (
							<FormControl.ErrorMessage>
								{errors?.confirmPassword}
							</FormControl.ErrorMessage>
						)}
					</FormControl>
					<FormControl>
						<FormControl.Label>Mac Address</FormControl.Label>
						<Input
							onChangeText={text => {
								const strippedMac = text
									.replace(/^a-zA-Z0-9]/g, ":")
									.trim();
								handleChange("macAdress", strippedMac);
							}}
						/>
						{errors?.macAdress && (
							<FormControl.ErrorMessage>
								{errors?.macAdress}
							</FormControl.ErrorMessage>
						)}
					</FormControl>
					<Button
						mt="2"
						colorScheme="indigo"
						onPress={async () => {
							await signUp(values).catch(alert);
						}}
						isDisabled={isSubmitting}>
						Sign up
					</Button>
				</VStack>
			</Box>
		</Center>
	);
}
