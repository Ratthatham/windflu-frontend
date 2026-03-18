import omise from 'omise';

const omiseClient = omise({
  publicKey: process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || '',
  secretKey: process.env.OMISE_SECRET_KEY || '',
});

export default omiseClient;

export const createCharge = async (amount: number, token: string, description: string) => {
  return new Promise((resolve, reject) => {
    omiseClient.charges.create({
      amount: amount * 100, // Omise uses subunits (Satang for THB)
      currency: 'thb',
      card: token,
      description,
    }, (error, charge) => {
      if (error) {
        reject(error);
      } else {
        resolve(charge);
      }
    });
  });
};
