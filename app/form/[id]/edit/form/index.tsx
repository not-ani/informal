import { useQuery } from "convex/react";
import { FormDetails } from "../details";
import { FormFields } from "./fields";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";


export function Form({
    id
}: {
    id: string
}) {

    const formDetails = useQuery(api.forms.get, { formId: id as Id<"forms"> });
    if (!formDetails) {
        return <div>Form not found</div>;
    }
    return (
        <div className=" w-2/3 md:w-4/5 lg:w-5/8  px-4">
            <FormDetails id={id} formDetails={formDetails} />
            <div className="mt-10">
                <FormFields id={id} defaultRequired={formDetails.defaultRequired ?? false} />
            </div>
        </div>
    )
}