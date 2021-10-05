import React, {useEffect, useState} from "react";
import clsx from "clsx";


const LandingBody = ({tariff, typePlatforms, refToPossibility, refToTariff, refToModules}) => {
    const [platforms, setPlatforms] = useState(typePlatforms)
    const [indexShowPlatform, setIndexShowPlatform] = useState(0)
    const [showPopover, setShowPopover] = useState(false)

    useEffect(() => {
        typeof typePlatforms === 'object' && setPlatforms(typePlatforms)
    }, [typePlatforms])

    return (
        <div className=" text-center">
            <p className="m-3 mt-20 text-2xl md:text-4xl font-bold md:leading-10">
                Платформа для оптимизации работы
                <br className="hidden md:block"/> с интернет-рекламой
            </p>

            <p className="m-3 mt-4 font-normal text-gray-600 text-lg">
                Автоматизируйте рутиные задачи, систематизируйте бизнес-процессы
                <br className="hidden md:block"/> и отслеживайте эффективность интернет-рекламы
            </p>

            <div className="flex justify-center m-3 mt-4">
                <Button type="primary" text="Попробовать бесплатно" onClick={() => refToModules && refToModules.current &&
                    refToModules.current.scrollIntoView({behavior: 'smooth', block: 'start',})}/>
            </div>

            <p className="m-3 text-gray-600 text-sm font-medium">14 дней пробный период</p>

            <img src={dashboard} className="w-full flex mx-auto m-3 mt-10" alt="dashboard"/>

            <BlockPossibility refToPossibility={refToPossibility}/>
            {typeof platforms === 'object' && <div className="flex">
                <div className="hidden md:inline-block md:float-right w-24 bg-gradient-to-r from-white via-white to-transparent
        z-30 mt-10"/>

                <div className="carusel m-3 md:mx-auto mt-10 rounded-lg bg-gold bg-opacity-25 p-3 w-full md:w-1/2">
                    <p className="m-3 md:m-5 flex">
                        <span className="text-left text-2xl font-semibold my-auto mr-4">Для кого?</span>
                        {Object.keys(platforms).map((key, index) => {
                            return <span className={clsx('h-2 w-2 rounded-full bg-gray-600 my-auto mx-1', {'h-4 w-4 bg-gold': index === indexShowPlatform})} key={key}/>
                        })}
                    </p>
                    <Flicking defaultIndex={0} zIndex={1} overflow={true} gap={100} onChange={e => setIndexShowPlatform(e.index)}>
                        <BlockTypePlatforms platforms={platforms} setPlatforms={setPlatforms}
                                            refToModules={refToModules}/>
                    </Flicking>
                </div>

                <div className="hidden md:inline-block md:float-right w-24 bg-gradient-to-r from-transparent via-white to-white
          z-30 mt-10"/>
            </div>}

            <p className="m-3 mt-10">
                <span ref={refToTariff} className="text-2xl md:text-3xl font-bold">Коэффициент нагрузки</span>
                <Popover
                    className="z-20"
                    body={<div className="w-64 rounded p-4 bg-black bg-opacity-75 text-white z-20">
                        Коэффициент нагрузки является множителем стоимости платформы в зависимости от количества обрабатываемых
                        лидов.
                        Чем больше лидов обрабатывает платформа, тем выше нагрузка, тем больше КФ
                    </div>}
                    isOpen={showPopover}>
                    <i className="material-icons inline-block align-top text-sm text-gray-600 cursor-pointer ml-1" onMouseEnter={
                        () => setShowPopover(true)} onMouseLeave={() => setShowPopover(false)}>help</i>
                </Popover>
            </p>

            <div className="m-3 flex flex-no-wrap md:justify-center overflow-x-auto mt-10 mx-5">
                <BlockTariff tariff={tariff}/>
            </div>

            <p ref={refToModules} className="m-3 mt-10 text-3xl font-bold">Выберите свою платформу</p>

            <MakePlatform platforms={platforms} setPlatforms={setPlatforms}/>
        </div>
    )
}

export default LandingBody

const BlockTariff = ({tariff}) => {
    return !tariff ? [] : Object.keys(tariff).map(key => {
        const elem = tariff[key];
        return <div className="m-3 p-6 text-center shadow md:w-54" key={key}>
            <span className="font-semibold  text-3xl text-gold">{elem.name}</span>
            <p className="text-gray-600 w-48 md:w-auto text-sm">Обработка платформой <br/>до {elem.name} лидов в месяц</p>
            <hr className="w-20 my-5 mx-auto border border-gold"/>
            <p className="font-semibold text-center text-4xl my-4">x{elem.k}</p>
            <span className="text-sm text-gray-600"> 14 дней бесплатно</span>
        </div>
    })
}

const BlockTypePlatforms = ({platforms, setPlatforms, refToModules}) => {
    return !platforms ? [] : Object.keys(platforms).map(key => {
        const elem = platforms[key];
        return <div className="p-4 md:p-8 w-full md:w-5/6 bg-white rounded-lg border" key={key}>
            <p className="text-left mb-3 flex">
                <i className="material-icons rounded text-gold  text-2xl my-auto">{elem['icon']}</i>
                <span className="md:text-lg font-semibold ml-2 my-auto">{elem['name']}</span>
            </p>
            <p className=" text-left mb-5">{elem['description']}</p>
            <Button className="mx-auto my-3" type="primary" text="Попробовать" onClick={() => {
                setPlatforms(prev => {
                    Object.keys(prev).map(el => prev[el]['current'] = el === key)
                    return {...prev}
                })
                refToModules && refToModules.current && refToModules.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })
            }}/>
            <span className="text-gray-600 text-sm">14 дней бесплатно</span>
        </div>
    })
}

const BlockPossibility = ({refToPossibility}) => {
    return (
        <div ref={refToPossibility} className="m-3 flex justify-center text-left mx-auto px-5 md:max-w-screen-md grid
          grid-cols-1 md:grid-cols-2 gap-4">
            <p className="my-4 text-2xl md:text-3xl font-bold md:col-span-2">Возможности для ваших задач</p>

            <div className="mt-4">
                <i className="text-5xl text-gold material-icons">assessment</i>
                <p className="text-xl font-semibold my-3">Статистика в едином центре</p>
                <span>Интегируйте свои рекламные кабинеты из более, чем 20 источников трафика. Optimido свяжет расходы и
          доходы в автоматическом режиме для отображения полной картины эффективности вашей рекламы.</span>
            </div>

            <div className="mt-4">
                <i className="text-5xl text-gold material-icons">build</i>
                <p className="text-xl font-semibold my-3">Маркетинговые инструменты</p>
                <span>Моментальное формирование 14 видов аналитик на основе данных из рекламных кабинетов, посещаемости и
          посетителей лендингов, ваших доходов для улучшения бизнес-процессов.</span>
            </div>

            <div className="mt-4">
                <i className="text-5xl text-gold material-icons">supervisor_account</i>
                <p className="text-xl font-semibold my-3">Командная работа</p>
                <span>Добавьте своих коллег и распределите зоны отвественности с помощью удобных иснтрументов для командной
          работы. Отслеживайте эффективность каждого члена команды.</span>
            </div>

            <div className="mt-4">
                <i className="text-5xl text-gold material-icons">account_balance_wallet</i>
                <p className="text-xl font-semibold my-3">Автоматическая бухгалтерия</p>
                <span>Счета, акты, сверки, выписки и полная финансовая картина вашей маркетинговой деятельности в удобном
          и функциональном отчете.</span>
            </div>
        </div>
    )
}