
import Masculino from "../assets/images/masculino.png";
import Feminino from "../assets/images/feminino.png";


function LogoMasculino() {
    return (
        <div
            style={{
                backgroundImage: "url(" + Masculino + ")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "100% 100%",
                backgroundSize: "cover",
                width: "95px",
                height: "94px",
                right: "20%",
                left: "20%",
                top: "8%",
                marginRight: "-10px",
                borderRadius: "100%",
                overflow: "hidden",
                borderBottom: "0px solid #f7f7f7",
            }}
        ></div>
    );
}

function LogoFeminino() {
  return (
    <div
      style={{
        backgroundImage: "url(" + Feminino + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "20% 20%",
        backgroundSize: "cover",
        width: "95px",
        height: "94px",
        right: "50%",
        top: "8%",
        marginRight: "-20px",
        borderRadius: "100%",
        overflow: "hidden",
        borderBottom: "0px solid #f7f7f7",

      }}
    ></div>
  );
}





export {

  LogoMasculino,
  LogoFeminino,
};