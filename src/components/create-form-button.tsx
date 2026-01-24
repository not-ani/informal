"use client";
/* eslint-disable react/no-children-prop */
/** biome-ignore-all lint/correctness/noChildrenProp: <explanation> */
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
});

export default function CreateFormButton() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const router = useRouter();
	const createForm = useMutation(api.forms.create);
	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
		},
		validators: {
			onChange: formSchema,
		},
		onSubmit: async ({ value }) => {
			const newFormId = await createForm({
				title: value.title,
				description: value.description,
			});
			router.push(`/form/${newFormId}/edit`);
		},
	});

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Plus className="h-4 w-4 mr-1" />
					Create
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Form</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field
							name="title"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Form Title</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Form Title"
											autoComplete="off"
										/>
										<FieldDescription>
											Provide a concise title for your form.
										</FieldDescription>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="description"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>
											Form Description
										</FieldLabel>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Form Description"
											className="min-h-[120px]"
										/>
										<FieldDescription>
											Provide a concise description for your form.
										</FieldDescription>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>

					<Button type="submit">Create</Button>
				</form>
				<DialogDescription>
					Create a new form to start collecting data.
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}
