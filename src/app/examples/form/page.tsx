"use client"

import { Controller, useForm, type Resolver } from "react-hook-form"
import { useState } from "react"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  environment: z.string().min(1, "Choose an environment."),
  privateProject: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>
const environments = ["development", "staging", "production"]

const zodResolver: Resolver<FormValues> = async (values) => {
  const result = await formSchema.safeParseAsync(values)

  if (result.success) {
    return { values: result.data, errors: {} }
  }

  const errors = {} as Record<string, { type: string, message: string }>
  for (const issue of result.error.issues) {
    const path = issue.path.join(".")

    if (!errors[path]) {
      errors[path] = { type: issue.code, message: issue.message }
    }
  }

  return { values: {}, errors }
}

export default function ProjectSettingsForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver,
    defaultValues: {
      name: "",
      environment: "",
      privateProject: false,
    },
  })
  const [submitted, setSubmitted] = useState<FormValues | null>(null)

  function onSubmit(data: FormValues) {
    setSubmitted(data)
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 py-16">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-h2">Project settings</h1>
        <p className="text-small text-muted-foreground">
          Example form to verify the theme tokens and form components.

        </p>
      </header>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldSet>
          <FieldLegend>Project details</FieldLegend>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="project-name"
                    placeholder="Acme Dashboard"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="environment"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-environment">Environment</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="project-environment"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select an environment" />
                    </SelectTrigger>
                    <SelectContent>
                      {environments.map((environment) => (
                        <SelectItem key={environment} value={environment}>
                          {environment}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    The deployment target for your project.



                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="privateProject"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                  <Checkbox
                    id="project-private"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldLabel className="font-normal" htmlFor="project-private">
                    Private project
                  </FieldLabel>
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <div className="mt-8 flex justify-end">
          <Button type="submit">Save settings</Button>
        </div>
      </form>

      {submitted && (
        <pre className="rounded-lg bg-muted p-4 text-small">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </div>
  )
}