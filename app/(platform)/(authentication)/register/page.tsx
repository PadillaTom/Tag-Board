"use client";

import * as z from "zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { register } from "@/actions/authentication";

const registerSchema = z
	.object({
		username: z.string().min(6, { message: "Mínimo 6 caracteres" }).email({ message: "El email no es válido." }),
		password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
		passwordConfirmation: z.string(),
	})
	.refine(
		(data) => {
			return data.password === data.passwordConfirmation;
		},
		{
			message: "Las contraseñas no coinciden.",
			path: ["passwordConfirmation"],
		}
	);

const RegisterPage = () => {
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: "",
			password: "",
			passwordConfirmation: "",
		},
	});

	const onSubmit = (values: z.infer<typeof registerSchema>) => {
		startTransition(async () => {
			const result = await register(values);
			if (result && result.error) {
				form.setError("root", {
					type: "manual",
					message: result.error,
				});
			} else {
				// Handle successful login, like redirecting the user
				console.log("Register OK!!!");
			}
		});
	};

	return (
		<div className="max-w-md w-full text-center">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						name="username"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input {...field} placeholder={"Email"} type="email" disabled={isPending}></Input>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="password"
						control={form.control}
						render={({ field }) => (
							<FormItem className="mt-5">
								<FormLabel>Contraseña</FormLabel>
								<FormControl>
									<Input {...field} placeholder={"Escriba su contraseña"} type="password" disabled={isPending}></Input>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="passwordConfirmation"
						control={form.control}
						render={({ field }) => (
							<FormItem className="mt-5">
								<FormLabel>Repita su contraseña</FormLabel>
								<FormControl>
									<Input {...field} placeholder={"Repita su contraseña"} type="password" disabled={isPending}></Input>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" variant={"default"} className="mt-10 w-auto px-12">
						Quiero unirme!
					</Button>
					{form.formState.errors.root && (
						<FormMessage className="mt-2">{form.formState.errors.root.message}</FormMessage>
					)}
				</form>
			</Form>
			<p className="mt-7 text-sm font-thin tracking-wide text-gray-700 underline">
				<Link href="/">Volver al inicio</Link>
			</p>
		</div>
	);
};

export default RegisterPage;