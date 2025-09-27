import { useAuth } from "./AuthProvider";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase/firebaseConnection";

export type Payment = {

  id?: string;
  value: number;
  createdBy?: string;
  createdAt: Date;

}

export type Debt = {

  id?: string;
  description?: string;
  totalValue: number;
  paidValue: number;
  dueDate: Date | null;
  createdAt: Date;
  createdBy: string;
  isPaid: boolean;
  payments?: Payment[];

}

export type Customer = {

  id?: string
  name: string
  createdAt: Date
  phone?: string
  cpf?: string
  debts?: Debt[]
  note?: string

}

type CustomersContextType = {

  customers: Customer[] | null
  loading: boolean
  error: string | null
  getAllCustomers: () => Promise<void>
  createCustomer: (customer: Omit<Customer, "id" | "debts" | "note">) => Promise<string | undefined>
  createDebt: (customerId: string, debt: Debt) => Promise<void>
  createPayment: (customerId: string, amountToApply: number, createdBy: string) => Promise<void>
  deleteCustomer: (customerId: string) => Promise<void>
  updateCustomerContact: (customerId: string, updates: { cpf?: string; phone?: string }) => Promise<void>

}

export const CustomersContext = createContext<CustomersContextType | undefined>(undefined)

export function CustomerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [customers, setCustomers] = useState<Customer[] | null>(null)


  useEffect(() => {

    // const mokeData: Customer[] = [
    //   {
    //     id: "1",
    //     createdAt: new Date(),
    //     name: 'Fernanda Brito',
    //     debts: [
    //       {
    //         id: "1",
    //         createdAt: new Date(),
    //         createdBy: 'Itamar',
    //         isPaid: false,
    //         dueDate: null,
    //         paidValue: 0,
    //         totalValue: 920,
    //         payments: [
    //           {
    //             id: "123",
    //             createdAt: new Date(),
    //             value: 920,
    //             createdBy: "Tailison"
    //           }
    //         ]
    //       },
    //       {
    //         id: "122",
    //         createdAt: new Date(),
    //         createdBy: 'Itamar',
    //         isPaid: false,
    //         dueDate: null,
    //         paidValue: 45,
    //         totalValue: 120,
    //         payments: [
    //           {
    //             id: "123",
    //             createdAt: new Date(),
    //             value: 120,
    //             createdBy: "Itamar"
    //           }
    //         ]
    //       },
    //       {
    //         id: "132",
    //         createdAt: new Date(),
    //         createdBy: 'Itamar',
    //         isPaid: false,
    //         dueDate: null,
    //         paidValue: 22,
    //         totalValue: 27,
    //         payments: [
    //           {
    //             id: "123",
    //             createdAt: new Date(),
    //             value: 27,
    //             createdBy: "Itamar"
    //           }
    //         ]
    //       },
    //       {
    //         id: "2",
    //         createdAt: new Date(),
    //         createdBy: 'Itamar',
    //         dueDate: new Date(),
    //         isPaid: true,
    //         paidValue: 80,
    //         totalValue: 80,
    //         payments: [
    //           {
    //             id: "123",
    //             createdAt: new Date(),
    //             value: 80,
    //             createdBy: "Tailison"
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   {
    //     id: "12",
    //     createdAt: new Date(),
    //     name: 'Jose SIlva',
    //     debts: [
    //       {
    //         id: "1",
    //         createdAt: new Date(),
    //         createdBy: 'Itamar',
    //         dueDate: new Date(),
    //         isPaid: true,
    //         paidValue: 50,
    //         totalValue: 50,
    //         payments: [
    //           {
    //             id: "123",
    //             createdAt: new Date(),
    //             value: 50,
    //             createdBy: "Tailison"
    //           }
    //         ]
    //       },
    //       {
    //         id: "2",
    //         createdAt: new Date(),
    //         createdBy: 'Itamar',
    //         isPaid: true,
    //         paidValue: 23.50,
    //         totalValue: 23.50,
    //         dueDate: new Date(),
    //         payments: [
    //           {
    //             id: "123",
    //             createdAt: new Date(),
    //             value: 23.50,
    //             createdBy: "Tailison"
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // ]

    // setCustomers(mokeData)

    const getData = async () => {
      await getAllCustomers()
    }

    getData()
  }, [user])



  const getAllCustomers = async () => {

    console.log("buyscando uysers")

    if (!user) {
      console.log('user nao encontrado', user)
      setError("Usuário não autorizado")
      setLoading(false)
      return
    }

    try {
      setLoading(true);
      setError(null);

      const customersRef = collection(db, "customers");

      const customersSnap = await getDocs(customersRef);

      const customersWithDebts = await Promise.all(

        customersSnap.docs.map(async (customerDoc) => {

          const customerRaw = customerDoc.data() as Customer
          const convertedDateCustomer = customerRaw.createdAt instanceof Timestamp ? customerRaw.createdAt.toDate() : customerRaw.createdAt;

          const debtsSnap = await getDocs(collection(db, "customers", customerDoc.id, "debts"))

          const debts: Debt[] = debtsSnap.docs.map((doc) => {
            const data = doc.data() as Debt
            // console.log(data)

            const convertedDateDebt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt;
            const convertedDueDate = data.dueDate instanceof Timestamp ? data.dueDate.toDate() : data.dueDate;

            return {
              id: data.id,
              createdAt: convertedDateDebt,
              dueDate: convertedDueDate,
              createdBy: data.createdBy,
              isPaid: data.isPaid,
              paidValue: data.paidValue,
              totalValue: data.totalValue,
              payments: data.payments
            } as Debt
          })

          const fullCustomer: Customer = {
            id: customerDoc.id,
            createdAt: convertedDateCustomer,
            cpf: customerRaw.cpf,
            phone: customerRaw.phone,
            name: customerRaw.name,
            debts: debts,
          }

          // console.log(fullCustomer)

          return fullCustomer
        })
      )

      customersWithDebts.sort((a, b) => a.name.localeCompare(b.name));

      setCustomers(customersWithDebts);

    } catch (err: any) {
      setError(err.message || "Erro ao buscar clientes");
      setCustomers(null);

    } finally {
      setLoading(false);
    }
  }


  const createCustomer = async (customer: Omit<Customer, "id" | "debts" | "note">) => {

    setLoading(true)

    const customerRef = collection(db, "customers");

    const newCustomer = customer

    try {
      const addedDocRef = await addDoc(customerRef, newCustomer)

      await getAllCustomers()

      setLoading(false)

      return addedDocRef.id.toString()

    } catch (error) {
      console.log("Erro ao adicionar doc")
      console.log(error)
      setLoading(false)
    }
  }


  const deleteCustomer = async (customerId: string | undefined) => {
    if (!customerId) return

    setLoading(true)

    try {
      const docRef = doc(db, "customers", customerId);

      await deleteDoc(docRef)

      await getAllCustomers()

      setLoading(false)

    } catch (error) {
      console.error(error);

      setLoading(false)
    }
  }

  const updateCustomerContact = async (
    customerId: string,
    updates: { cpf?: string; phone?: string }
  ): Promise<void> => {
    if (!customerId || (!updates.cpf && !updates.phone)) return;

    setLoading(true);

    try {
      const customerRef = doc(db, "customers", customerId);

      await updateDoc(customerRef, {
        ...(updates.cpf && { cpf: updates.cpf }),
        ...(updates.phone && { phone: updates.phone }),
      });

      await getAllCustomers();
    } catch (error) {
      console.error("Erro ao atualizar CPF/Telefone:", error);
    } finally {
      setLoading(false);
    }
  };


  const createDebt = async (customerId: string, debt: Debt) => {

    setLoading(true)

    console.log("dentro funçao createdebt")

    const customerDocRef = doc(db, "customers", customerId);

    console.log("debtsRef")
    const debtsRef = collection(customerDocRef, "debts")

    console.log("montando objeto Debt")
    const debtData: Debt = {
      createdAt: debt.createdAt,
      createdBy: debt.createdBy,
      dueDate: debt.dueDate,
      isPaid: debt.isPaid,
      paidValue: debt.paidValue,
      totalValue: debt.totalValue,
    }

    console.log("trycatch createDebt")

    try {
      console.log("Adicionando compra no fuirebvase")
      const idDebt = await addDoc(debtsRef, debtData)

      console.log(idDebt)

      await getAllCustomers()

      setLoading(false)
    } catch (error) {
      console.log("Erro ao adicionbar")
      console.log(error)
      setLoading(false)
    }

  }

  const createPayment = async (customerId: string, amountToApply: number, createdBy: string) => {

    setLoading(true)
    try {
      const customerRef = doc(db, "customers", customerId);
      const debtsRef = collection(customerRef, "debts");

      // Busca as dívidas ordenadas por data de criação (primeiro as mais antigas)
      const q = query(debtsRef, orderBy("createdAt", "asc"));
      const debtsSnapshot = await getDocs(q);

      // Valor restante a ser distribuído entre as dívidas
      let remaining = amountToApply;

      // Itera por todas as dívidas do cliente
      for (const docSnap of debtsSnapshot.docs) {
        // Se o valor já foi totalmente distribuído, sai do loop
        if (remaining <= 0) break;

        const debtData = docSnap.data() as Debt; // Dados da dívida atual
        const debtId = docSnap.id;

        const paidValue = debtData.paidValue || 0;      // Valor já pago
        const totalValue = debtData.totalValue;         // Valor total da dívida

        // Calcula quanto ainda falta pagar nesta dívida
        const toPay = Math.min(totalValue - paidValue, remaining);

        console.log(toPay)

        // Se a dívida já estiver totalmente paga, continua para a próxima
        if (toPay <= 0) continue;

        // Novo valor total pago após o abatimento
        const newPaidValue = paidValue + toPay;

        // Verifica se a dívida foi totalmente quitada
        const isPaid = newPaidValue >= totalValue;

        // Atualiza os campos da dívida no Firestore
        await updateDoc(doc(db, "customers", customerId, "debts", debtId), {
          paidValue: newPaidValue,
          dueDate: new Date(),
          isPaid: isPaid,
        });

        // Cria um novo registro de pagamento na subcoleção "payments"
        await addDoc(collection(db, "customers", customerId, "debts", debtId, "payments"), {
          value: toPay,
          createdBy,
          createdAt: new Date(),
        });

        // Reduz o valor restante a ser aplicado
        remaining -= toPay;
      }

      await getAllCustomers()

      setLoading(false)
    } catch (error) {
      console.log("Erro ao abater valor da conta")
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <CustomersContext.Provider value={{
      customers, loading, error, getAllCustomers, createCustomer, createDebt, createPayment, deleteCustomer, updateCustomerContact
    }}>
      {children}
    </CustomersContext.Provider>
  );


}

export function useCustomers() {
  const context = useContext(CustomersContext);
  if (!context) {
    throw new Error("useCustomer deve ser usado dentro de AuthProvider");
  }
  return context;
}