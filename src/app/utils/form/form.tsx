/* eslint-disable @typescript-eslint/no-explicit-any */

import { InputNumberChangeEvent } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { memo } from "react";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldError,
  FieldPath,
  FieldValues,
  PathValue,
} from "react-hook-form";

/**
 * @deprecated use `Input` instead
 */
export const input = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
  TDefaultValue extends PathValue<TFieldValues, TFieldName>
>({
  control,
  name,
  label,
  render,
  defaultValue,
}: {
  control: Control<TFieldValues>;
  name: TFieldName;
  label: string;
  defaultValue: TDefaultValue extends Array<unknown>
    ? TDefaultValue
    : TDefaultValue extends Date
    ? Date | null
    : TDefaultValue extends object
    ? undefined
    : TDefaultValue | "";
  //PathValue<TFieldValues, TFieldName> | null;
  render: (i: {
    props: object;
    fieldState: ControllerFieldState;
    field: ControllerRenderProps<TFieldValues, TFieldName>;
  }) => JSX.Element;
}) => {
  return (
    <Controller
      defaultValue={defaultValue}
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const props: object = {
          id: field.name,
          className: classNames({ "p-invalid": fieldState.error }),
          value: field.value,
          onChange: field.onChange,
          onBlur: field.onBlur,
        };

        return (
          <>
            <label
              htmlFor={field.name}
              className={classNames({
                "p-error": fieldState.error,
              })}
            >
              {label}
            </label>
            {render({ props, fieldState, field })}
            {getFormErrorMessage(fieldState.error)}
          </>
        );
      }}
    />
  );
};

type InputProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  control: Control<TFieldValues>;
  name: TFieldName;
  label: string;
  defaultValue: PathValue<TFieldValues, TFieldName>;
  render: (args: {
    props: object;
    fieldState: ControllerFieldState;
    field: ControllerRenderProps<TFieldValues, TFieldName>;
  }) => JSX.Element;
};
type StyledInputProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  control: Control<TFieldValues>;
  name: TFieldName;
  label: string;
  defaultValue: PathValue<TFieldValues, TFieldName>;
  render: () => JSX.Element;
};

export const InputUnmemoised = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
  // TDefaultValue extends PathValue<TFieldValues, TFieldName>
>({
  control,
  name,
  label,
  render,
  defaultValue,
}: InputProps<TFieldValues, TFieldName>) => {
  return (
    <Controller
      defaultValue={defaultValue}
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const props: object = {
          id: field.name,
          className: classNames({ "p-invalid": fieldState.error }),
          value: field.value,
          onChange:
            typeof defaultValue === "number"
              ? (e: InputNumberChangeEvent) => field.onChange(e.value)
              : field.onChange,
          onBlur: field.onBlur,
          ref: field.ref,
        };

        return (
          <>
            <label
              htmlFor={field.name}
              className={classNames("block", {
                "p-error": fieldState.error,
              })}
            >
              {label}
            </label>
            {render({ props, fieldState, field })}
            {getFormErrorMessage(fieldState.error)}
          </>
        );
      }}
    />
  );
};

const StyledInputUnmemoised = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  render,
  defaultValue,
}: StyledInputProps<TFieldValues, TFieldName>) => {
  return (
    <Controller
      defaultValue={defaultValue}
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <>
            <label
              htmlFor={field.name}
              className={classNames({
                "p-error": fieldState.error,
              })}
            >
              {label}
            </label>
            {render()}
            {getFormErrorMessage(fieldState.error)}
          </>
        );
      }}
    />
  );
};

const typedMemo: <
  TComponent extends (...args: any) => JSX.Element,
  TProps = Parameters<TComponent>[0]
>(
  Component: TComponent,
  propsAreEqual?:
    | ((prevProps: Readonly<TProps>, nextProps: Readonly<TProps>) => boolean)
    | undefined
) => TComponent = memo;

export const memoiseNestedFormComponent = <
  TProps extends { control: Control<any> }
>(
  Component: (__0: TProps) => JSX.Element
) =>
  typedMemo(Component, (prev, next) => {
    return prev.control._formState.isDirty === next.control._formState.isDirty;
  });

export const Input = memoiseNestedFormComponent(InputUnmemoised);
export const StyledInput = memoiseNestedFormComponent(StyledInputUnmemoised);

/**
 * @deprecated use `StyledInput` instead
 */
export const styledInput = ({
  label,
  error,
  render,
}: {
  label: string;
  error?: FieldError;
  render: () => JSX.Element;
}) => {
  return (
    <>
      <label
        className={classNames({
          "p-error": error,
        })}
      >
        {label}
      </label>
      {render()}
      {getFormErrorMessage(error)}
    </>
  );
};

export const getFormErrorMessage = (err?: FieldError | string) => {
  return (
    <small className="p-error">
      {err ? typeof err === "string" ? err : err.message : <></>}
    </small>
  );
};
