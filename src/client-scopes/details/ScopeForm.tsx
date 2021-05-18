import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import {
  Form,
  FormGroup,
  ValidatedOptions,
  TextInput,
  Select,
  SelectVariant,
  SelectOption,
  Switch,
  ActionGroup,
  Button,
} from "@patternfly/react-core";

import ClientScopeRepresentation from "keycloak-admin/lib/defs/clientScopeRepresentation";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { useLoginProviders } from "../../context/server-info/ServerInfoProvider";
import { convertToFormValues } from "../../util";

type ScopeFormProps = {
  clientScope: ClientScopeRepresentation;
  save: (clientScope: ClientScopeRepresentation) => void;
};

export const ScopeForm = ({ clientScope, save }: ScopeFormProps) => {
  const { t } = useTranslation("client-scopes");
  const { register, control, handleSubmit, errors, setValue } = useForm();
  const history = useHistory();
  const providers = useLoginProviders();
  const [open, isOpen] = useState(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    Object.entries(clientScope).map((entry) => {
      if (entry[0] === "attributes") {
        convertToFormValues(entry[1], "attributes", setValue);
      }
      setValue(entry[0], entry[1]);
    });
  }, [clientScope]);

  return (
    <Form isHorizontal onSubmit={handleSubmit(save)} className="pf-u-mt-md">
      <FormGroup
        label={t("common:name")}
        labelIcon={
          <HelpItem
            helpText="client-scopes-help:name"
            forLabel={t("common:name")}
            forID="kc-name"
          />
        }
        fieldId="kc-name"
        isRequired
        validated={
          errors.name ? ValidatedOptions.error : ValidatedOptions.default
        }
        helperTextInvalid={t("common:required")}
      >
        <TextInput
          ref={register({ required: true })}
          type="text"
          id="kc-name"
          name="name"
          validated={
            errors.name ? ValidatedOptions.error : ValidatedOptions.default
          }
        />
      </FormGroup>
      <FormGroup
        label={t("common:description")}
        labelIcon={
          <HelpItem
            helpText="client-scopes-help:description"
            forLabel={t("common:description")}
            forID="kc-description"
          />
        }
        fieldId="kc-description"
        validated={
          errors.description ? ValidatedOptions.error : ValidatedOptions.default
        }
        helperTextInvalid={t("common:maxLength", { length: 255 })}
      >
        <TextInput
          ref={register({
            maxLength: 255,
          })}
          validated={
            errors.description
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
          type="text"
          id="kc-description"
          name="description"
        />
      </FormGroup>
      {!id && (
        <FormGroup
          label={t("protocol")}
          labelIcon={
            <HelpItem
              helpText="client-scopes-help:protocol"
              forLabel="protocol"
              forID="kc-protocol"
            />
          }
          fieldId="kc-protocol"
        >
          <Controller
            name="protocol"
            defaultValue={providers[0]}
            control={control}
            render={({ onChange, value }) => (
              <Select
                toggleId="kc-protocol"
                required
                onToggle={() => isOpen(!open)}
                onSelect={(_, value) => {
                  onChange(value as string);
                  isOpen(false);
                }}
                selections={value}
                variant={SelectVariant.single}
                aria-label={t("selectEncryptionType")}
                isOpen={open}
              >
                {providers.map((option) => (
                  <SelectOption
                    selected={option === value}
                    key={option}
                    value={option}
                  />
                ))}
              </Select>
            )}
          />
        </FormGroup>
      )}
      <FormGroup
        hasNoPaddingTop
        label={t("displayOnConsentScreen")}
        labelIcon={
          <HelpItem
            helpText="client-scopes-help:displayOnConsentScreen"
            forLabel={t("displayOnConsentScreen")}
            forID="kc-display.on.consent.screen"
          />
        }
        fieldId="kc-display.on.consent.screen"
      >
        <Controller
          name="attributes.display-on-consent-screen"
          control={control}
          defaultValue="false"
          render={({ onChange, value }) => (
            <Switch
              id="kc-display.on.consent.screen"
              label={t("common:on")}
              labelOff={t("common:off")}
              isChecked={value === "true"}
              onChange={(value) => onChange("" + value)}
            />
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("consentScreenText")}
        labelIcon={
          <HelpItem
            helpText="client-scopes-help:consentScreenText"
            forLabel={t("consentScreenText")}
            forID="kc-consent-screen-text"
          />
        }
        fieldId="kc-consent-screen-text"
      >
        <TextInput
          ref={register}
          type="text"
          id="kc-consent-screen-text"
          name="attributes.consent-screen-text"
        />
      </FormGroup>
      <FormGroup
        hasNoPaddingTop
        label={t("includeInTokenScope")}
        labelIcon={
          <HelpItem
            helpText="client-scopes-help:includeInTokenScope"
            forLabel={t("includeInTokenScope")}
            forID="includeInTokenScope"
          />
        }
        fieldId="includeInTokenScope"
      >
        <Controller
          name="attributes.include-in-token-scope"
          control={control}
          defaultValue="false"
          render={({ onChange, value }) => (
            <Switch
              id="includeInTokenScope"
              label={t("common:on")}
              labelOff={t("common:off")}
              isChecked={value === "true"}
              onChange={(value) => onChange("" + value)}
            />
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("guiOrder")}
        labelIcon={
          <HelpItem
            helpText="client-scopes-help:guiOrder"
            forLabel={t("guiOrder")}
            forID="kc-gui-order"
          />
        }
        fieldId="kc-gui-order"
        helperTextInvalid={t("shouldBeANumber")}
        validated={
          errors.attributes && errors.attributes["gui_order"]
            ? ValidatedOptions.error
            : ValidatedOptions.default
        }
      >
        <TextInput
          ref={register({ pattern: /^([0-9]*)$/ })}
          type="text"
          id="kc-gui-order"
          name="attributes.gui-order"
          validated={
            errors.attributes && errors.attributes["gui_order"]
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
        />
      </FormGroup>
      <ActionGroup>
        <Button variant="primary" type="submit">
          {t("common:save")}
        </Button>
        <Button variant="link" onClick={() => history.push("/client-scopes/")}>
          {t("common:cancel")}
        </Button>
      </ActionGroup>
    </Form>
  );
};