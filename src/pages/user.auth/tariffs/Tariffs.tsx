import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import BlockTariff, {RowTariff} from "@pages/user.auth/tariffs/BlockTariff";
//server
import workWithServer from "@core/workWithServer";

//redux
import {setCurrentUser} from "@/store/features/userSlice";
import {addAlert} from "@/store/features/alertSlice";
import {Button} from "@components/Base/Button";



export default function Tariffs() {
  const initUser = useAppSelector((state) => state.user.currentUser)
  const dispatch = useAppDispatch()
  const [user, setUser] = useState(initUser)

  return (
    <>
      <p className="font-bold text-xl">Тарифы</p>
      <div className="md:grid md:grid-cols-3 md:justify-items-center">
        <BlockTariff title="Бесплатный">
          <RowTariff name='Статистики'>
            <span>1 статистика</span>
          </RowTariff>
          <RowTariff name='Портфолио'>
            <i className="material-icons text-gold ml-auto">close</i>
          </RowTariff>
          <RowTariff name='Хранение'>
            <span>30 дней</span>
          </RowTariff>
          <p className="text-center font-semibold text-lg mt-8">0 ₽/мес</p>
          <Button
            className="mt-2 mx-auto px-4"
            type="primary"
            text={user.tariff === 'FREE' ? 'Текущий тариф' : 'Перейти'}
            disabled={user.tariff === 'FREE'}
          />
        </BlockTariff>
        <BlockTariff title="1 месяц">
          <RowTariff name='Статистики'>
            <i className="material-icons text-gold ml-auto">all_inclusive</i>
          </RowTariff>
          <RowTariff name='Портфолио'>
            <i className="material-icons text-gold ml-auto">done</i>
          </RowTariff>
          <RowTariff name='Хранение'>
            <i className="material-icons text-gold ml-auto">all_inclusive</i>
          </RowTariff>
          <p className="text-center font-semibold text-lg mt-8">1100 ₽/мес</p>
          <Button
            className="mt-2 mx-auto px-4"
            type="primary"
            text={user.tariff === 'PAID' ? 'Текущий тариф' : 'Перейти на Платный'}
            disabled={user.tariff === 'PAID'}
          />
        </BlockTariff>
        <BlockTariff title="3 месяца">
          <RowTariff name='Статистики'>
            <i className="material-icons text-gold ml-auto">all_inclusive</i>
          </RowTariff>
          <RowTariff name='Портфолио'>
            <i className="material-icons text-gold ml-auto">done</i>
          </RowTariff>
          <RowTariff name='Хранение'>
            <i className="material-icons text-gold ml-auto">all_inclusive</i>
          </RowTariff>
          <p className="text-center font-semibold text-lg mt-8"><span className="line-through">3300</span> 2500 ₽/мес</p>
          <Button
            className="mt-2 mx-auto px-4"
            type="primary"
            text={'Воспользоваться скидкой'}
          />
        </BlockTariff>
      </div>
    </>
  )
}