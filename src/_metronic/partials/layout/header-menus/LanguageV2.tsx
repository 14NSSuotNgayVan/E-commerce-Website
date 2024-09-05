
import clsx from 'clsx';
import { FC } from 'react';
import { toAbsoluteUrl } from '../../../helpers';
import { useLang, setLanguage } from '../../../i18n/Metronici18n';
import { useIntl } from 'react-intl';
import './custom.scss';
const languages = [
    {
        lang: 'en',
        name: 'English',
        flag: toAbsoluteUrl('/media/flags/united-states.svg'),
    },
    {
        lang: 'vi',
        name: 'Tiếng việt',
        flag: toAbsoluteUrl('/media/flags/vietnam.svg'),
    },
]

const LanguageV2: FC = () => {
    const lang = useLang();
    const intl = useIntl();
    const currentLanguage = languages.find((x) => x.lang === lang);
    return (
        <div className='toggle-language'>
            <a className='current-language px-5 w-150px'>
                <span className='position-relative'>
                    <span className='w-150px rounded bg-light px-3 py-2 translate-middle-y'>
                        {currentLanguage?.name}{' '}
                        <img
                            className='w-15px h-15px rounded-1 ms-2'
                            src={currentLanguage?.flag}
                            alt='metronic'
                        />
                    </span>
                </span>
            </a>

            <div className='menu-sub w-150px'>
                {languages.map((l) => (
                    <div
                        className='menu-item px-3'
                        key={l.lang}
                        onClick={() => {
                            setLanguage(l.lang)
                        }}
                    >
                        <a
                            href='#'
                            className={clsx('menu-link d-flex px-5', { active: l.lang === currentLanguage?.lang })}
                        >
                            <span className='symbol symbol-20px me-4'>
                                <img className='rounded-1' src={l.flag} alt='metronic' />
                            </span>
                            {l.name}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export { LanguageV2 }
