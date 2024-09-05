import { useIntl } from "react-intl";

const useMultiLanguage = () => {
  const intl = useIntl();

  const lang = (idJson: string) => {
    return intl.formatMessage({ id: idJson });
  };

  return { intl, lang };
};

export default useMultiLanguage;
