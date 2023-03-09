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
	Text,
} from "native-base";
import { useFormValidation } from "../hooks/useFormValidation";
import { validateSignInForm } from "../utils/validation";

export default function SignInScreen() {
	const { values, errors, isSubmitting, handleChange, handleSubmit } =
		useFormValidation({ email: "", password: "" }, validateSignInForm);
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
							onChangeText={text => handleChange("email", text)}
						/>
						<FormControl.HelperText>
							We'll never share your email.
						</FormControl.HelperText>
						{errors.email && (
							<FormControl.ErrorMessage>
								{errors.email}
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
						{errors.password && (
							<FormControl.ErrorMessage>
								{errors.password}
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
						onPress={handleSubmit}
						_disabled={isSubmitting}>
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
