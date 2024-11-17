import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useTimer } from "../../hooks/useTimer";
import LogoApp from "../../components/LogoApp";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function SignUpPage() {
  const { color } = useTimer();
  const { signUp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "all",
  });

  const onSubmit = async (data) => {
    try {
      await signUp(data.username, data.password);

      toast({
        title: "Sign up success!",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <Center
      backgroundColor={color}
      w={"100%"}
      minH={"100vh"}
      flexDirection={"column"}
    >
      <LogoApp />
      <Box
        borderRadius={15}
        backgroundColor={"white"}
        px={"40px"}
        py="40px"
        mt="60px"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={5} mb="40px">
            <FormControl isRequired isInvalid={errors.username}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                type="text"
                width={500}
                id="username"
                {...register("username", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9]*$/,
                    message: "Only letters and numbers",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                type="password"
                width={500}
                id="password"
                {...register("password", {
                  required: "This is required",
                  minLength: {
                    value: 6,
                    message: "Minimum length should be 6",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.confirmPassword}>
              <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
              <Input
                type="password"
                width={500}
                id="confirmPassword"
                {...register("confirmPassword", {
                  required: "This is required",
                  minLength: {
                    value: 6,
                    message: "Minimum length should be 6",
                  },
                  validate: (value, values) =>
                    value === values["password"] ||
                    "The passwords do not match",
                })}
              />
              <FormErrorMessage>
                {errors.confirmPassword && errors.confirmPassword.message}
              </FormErrorMessage>
            </FormControl>
          </VStack>
          <Button
            size={"lg"}
            width={"100%"}
            type="submit"
            isLoading={isSubmitting}
            disabled={!isValid}
          >
            Sign up
          </Button>
        </form>
      </Box>
      <Text
        fontWeight={"bold"}
        fontSize={"20px"}
        color={"rgba(255,255,255,0.9)"}
        mt="20px"
      >
        Already have an account?
      </Text>
      <Button
        fontSize={"20px"}
        color={"white"}
        variant={"link"}
        mt="15px"
        onClick={() => navigate("/sign-in")}
      >
        Sign in
      </Button>
    </Center>
  );
}
