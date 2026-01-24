"use client";
import { useForm } from "@/components/forms/context";
import { FormBuilder } from "@/components/forms/editor/builder/form-builder";
import { FormHeader } from "@/components/forms/editor/builder/form-header";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { Chat } from "./_chat";
export default function Page() {
	const form = useForm();
	const fields = useQuery(api.fields.listByForm, { formId: form._id });
	const sections = useQuery(api.sections.listByFormId, {
		formId: form._id,
	});

	return (
		<main className="h-screen w-full overflow-hidden">
			<div className="flex h-full w-full">
				<div className="h-full w-full flex flex-col md:w-3/4 items-center gap-10 pt-10 overflow-y-scroll p-10">
					<FormHeader form={form} formId={form._id} />
					<FormBuilder
						fields={fields ?? []}
						formId={form._id}
						sections={sections ?? []}
					/>
				</div>
				<div className="h-full w-0 md:w-1/4 border-l border-border flex flex-col items-center gap-10 pt-10 overflow-y-scroll">
					<Chat id={form._id} />
				</div>
			</div>
		</main>
	);
}
