import { useContext, useEffect } from "react";
import {
	FormControl,
	Input,
	Box,
	Center,
	Heading,
	VStack,
	Button,
	HStack,
	Text,
	useColorModeValue,
	useToast,
	KeyboardAvoidingView,
} from "native-base";
import { useFormValidation } from "../hooks/useFormValidation";
import { validateSignInForm } from "../utils/validation";
import { AuthContext } from "../contexts/authContext";
import { LoadingContext } from "../contexts/loadingContext";
import { Platform } from "react-native";

export default function SignInScreen({ navigation }) {
	const { values, errors, isSubmitting, handleChange, handleSubmit } =
		useFormValidation({ email: "", password: "" }, validateSignInForm);

	const { login } = useContext(AuthContext);
	const { setLoading } = useContext(LoadingContext);

	const bg = useColorModeValue("white", "coolGray.800");

	const toast = useToast();

	useEffect(() => {
		if (isSubmitting) setLoading(true);

		if (isSubmitting && Object.values(errors).some(error => !error)) {
			login(values)
				.then(() => {
					setLoading(false);

					toast.show({
						avoidKeyboard: true,
						title: "Signed in",
						description: "You have been signed in",
					});
				})
				.catch(err => {
					setLoading(false);
					toast.show({
						avoidKeyboard: true,
						title: "Error signing in",
						description: err.message,
					});
				});
		}
	}, [isSubmitting]);

	return (
		<Box flex="1" safeArea bg={bg} width="100%">
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
						<KeyboardAvoidingView
							behavior={
								Platform.OS === "ios" ? "padding" : "height"
							}
							height="auto">
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
							<Button
								mt="2"
								colorScheme="indigo"
								onPress={async () => handleSubmit()}
								_disabled={isSubmitting}>
								Sign in
							</Button>
							<HStack
								mt="6"
								alignItems="center"
								justifyContent="center">
								<Text
									fontSize="sm"
									color="coolGray.600"
									_dark={{
										color: "warmGray.200",
									}}>
									I'm a new user.{" "}
								</Text>
								<Button
									variant="link"
									onPress={() => {
										navigation.navigate("Sign Up");
									}}>
									<Text
										fontWeight="bold"
										color="indigo.500"
										underline
										_dark={{
											color: "indigo.300",
										}}>
										Sign Up
									</Text>
								</Button>
							</HStack>
						</KeyboardAvoidingView>
					</VStack>
				</Box>
			</Center>
		</Box>
	);
}
