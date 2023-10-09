"use client";

import {
  StudentPostBody,
  StudentPostErrorResponse,
  StudentPostOKResponse,
} from "@/app/api/student/route";
import { Button, Group, Paper, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse, isAxiosError } from "axios";
import { FC } from "react";

type Form = StudentPostBody;
export const AddStudentSection: FC = () => {
  const form = useForm<Form>({
    initialValues: {
      studentId: "",
      firstName: "",
      lastName: "",
    },
  });

  const studentPostMutation = useMutation({
    mutationFn: async (body: StudentPostBody) => {
      try {
        const response = await axios.post<
          {},
          AxiosResponse<StudentPostOKResponse>
        >("/api/student", body);
        return response.data;
      } catch (error) {
        if (isAxiosError<StudentPostErrorResponse>(error) && error.response) {
          return error.response.data;
        } else {
          return null;
        }
      }
    },
  });

  const { refetch } = useQuery({
    queryKey: ["StudentGet"],
  });

  const callStudentPost = async () => {
    try {
      const resp = await studentPostMutation.mutateAsync(form.values);
      console.log(resp);
      if (!resp) {
        alert("Oops, please try again later");
      } else if (!resp.ok) {
        if (resp.message === "Student Id already exists") {
          alert("Student ID already exists");
        } else {
          alert(resp.message);
        }
      } else {
        refetch();
      }
    } catch (error) {
      console.error(error); 
      alert("Oops, please try again later");
    }
  };
  

  return (
    <Paper withBorder p="xs">
      <Stack gap="xs">
        <Title order={4}>Add Student</Title>
        <form onSubmit={form.onSubmit(() => callStudentPost())}>
          <Group preventGrowOverflow wrap="nowrap" align="flex-end">
            <TextInput
              label="Student ID"
              name="studentId"
              required
              maxLength={9}
              minLength={9}
              {...form.getInputProps("studentId")}
            />
            <TextInput
              label="First name"
              name="firstName"
              required
              {...form.getInputProps("firstName")}
            />
            <TextInput
              label="Last name"
              name="lastName"
              required
              {...form.getInputProps("lastName")}
            />
            <Button type="submit" loading={studentPostMutation.isLoading}>
              Add
            </Button>
          </Group>
        </form>
      </Stack>
    </Paper>
  );
};
