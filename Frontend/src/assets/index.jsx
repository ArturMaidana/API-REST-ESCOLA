// Importações de Componentes
import Logo from "./images/410239800_658740643127977_6187674195040778479_n.jpg"; /* 512 x 512 px */

function LogoComponent() {
  return (
    <img
      src={Logo}
      alt="Logo do Vale do Pacu"
      style={{
        margin: "15px",
        width: "100px",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  );
}

export { LogoComponent };
