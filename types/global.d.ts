// types/global.d.ts
interface Window {
  paypal: {
    Buttons: (options: any) => {
      render: (container: string) => void;
    };
  };
}
