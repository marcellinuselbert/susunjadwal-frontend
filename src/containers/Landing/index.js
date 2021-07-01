import { Box, Button, Image, Select } from "@chakra-ui/react";
import React from "react";
import RistekBetaLogo from "assets/Beta/Beta_Logo.svg";
import SunjadBetaLogo from "assets/Beta/Sunjad_Beta.svg";
import { InputEmail, InputText } from "components/Forms";
// import decorLandingTop from "assets/Beta/decor1.svg";
import { useForm } from "react-hook-form";

const Landing = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values) {
    alert(JSON.stringify(values, null, 2));
  }

  return (
    <Box>
      {/* <Image 
        objectFit="contain"
        position='absolute'
        zIndex='1000'
        top='0'
        left='0'
        src={decorLandingTop}
        alt="decor"
        display={{base: 'block', semiMd:'none'}}
        w='full'
      /> */}
      <Image
        objectFit="contain"
        m="auto"
        src={RistekBetaLogo}
        alt="ristek beta"
        sx={{ transform: "translate(0, 20px)" }}
        w={{ base: "178px", semiMd: "initial" }}
      />
      <Image
        objectFit="contain"
        m="auto"
        src={SunjadBetaLogo}
        alt="sunjad beta"
        maxW={{ base: "280px", semiMd: "380px", lg: "initial" }}
      />
      <Button variant="solid">Jadi Beta Tester</Button>
      <Button variant="solid">Daftar</Button>
      <Button variant="ghost">Jadi Beta Tester</Button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText
          label="Nama lengkap"
          name="nama"
          register={register}
          placeholder="Nama lengkap"
          validator={{
            required: `Nama lengkap tidak boleh kosong`,
            // minLength: { value: 3, message: "Minimum length should be 3" },
          }}
          errors={errors}
        />

        <InputEmail
          label="Email"
          name="email"
          register={register}
          placeholder="Email"
          validator={{
            required: `Email tidak boleh kosong`,
          }}
          errors={errors}
        />

        <Select bg='secondary.InputGray' variant='filled' placeholder="Select option">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>

        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default Landing;
