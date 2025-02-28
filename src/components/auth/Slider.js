import * as sc from "./styles";
import { LogoInicial } from "../../styles/generalStyles";
import { useWindowSize } from "../../hooks/generalHooks";

export default function Slider({ igniteMotion, side }) {
  const animationBoundarie = (useWindowSize().width * 0.8) / 2;
  const variants = {
    left: { x: 20 },
    right: { x: animationBoundarie - 20 },
  };

  return (
    <sc.SliderContainer
      variants={variants}
      initial={side}
      animate={side}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 30,
        duration: 0.1,
      }}
    >
      <LogoInicial src={"./assets/piotto-logo-inicial.png"} />
      <p onClick={igniteMotion}>
        {side === "right"
          ? "« Já possui uma conta? Entre"
          : "Ainda não possui uma conta? Cadastre-se »"}
      </p>
    </sc.SliderContainer>
  );
}
