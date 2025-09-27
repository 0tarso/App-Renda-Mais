import { Linking } from "react-native";
import Toast from "react-native-toast-message";

import { Customer, Debt } from "@/contexts/CustomersProvider";

interface SendMessageWppProps {
  customer?: Customer;
  message?: string;
  debt?: Debt;
}

export const sendMessageToWppCustomer = ({ customer, message, debt }: SendMessageWppProps) => {
  if (!customer?.phone) {
    Toast.show({
      type: 'error',
      text1: 'Telefone não cadastrado',
      text2: 'Não foi possível enviar a mensagem.',
    })
    return;
  }

  const formattedPhone = customer.phone?.replace(/\D/g, ''); // Remove non-numeric characters

  let messageToSend = message;

  if (!messageToSend) {
    messageToSend = debt

      ? `Olá, ${customer?.name || 'Cliente'}! Tudo bem com você?
      
==== 🎉 Você fez uma nova compra 🎉 ====

--> Valor: R$${debt.totalValue.toFixed(2)} ✅
--> Confirmada em: ${debt.createdAt.toLocaleDateString('pt-BR')} às ${debt.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} ✅
      
🤝Obrigado pela preferência! Se precisar de ajuda, estamos à disposição! 🤝`
      : `Olá, ${customer?.name || 'Cliente'}! Tudo bem com você?`;
  }

  const url = `https://wa.me/55${formattedPhone}?text=${encodeURIComponent(messageToSend)}`;

  // Open WhatsApp link
  Linking.openURL(url).catch((err) => {
    console.error('Failed to open WhatsApp:', err);

    Toast.show({
      type: 'error',
      text1: 'Erro ao abrir WhatsApp',
      text2: 'Verifique se o aplicativo está instalado.',
    });
  });
}