import Aux from "../../hoc/Auxiliary/Auxiliary";
import withClass from "../../hoc/withClass/withClass";
import classes from "./termsComponent.module.css";
const TermsComponent = () => {
  return (
    <Aux>
      <h2>תקנון האתר</h2>
      <ul>
        <li>
          אתר שיווק שותפים זה (להלן "האתר") הוא בבעלות ובניהול של חדר המציאות.
        </li>
        <br />
        <li>
          האתר מתמקד בשותפות עם אלי אקספרס ומספק גם אופציה לחיבור משתמשים מאתרים
          נוספים.
        </li>
        <br />
        <li>
          האתר אינו אחראי לשום אחריות ביחס למוצרים או הזמנות, והכל באחריות המוכר
          המקורי.
        </li>
        <br />
        <li>
          אנו מחייבים תהליכי אבטחה מתקדמים כדי לשמור על מידע אישי של המשתמשים.
        </li>
        <br />
        <li>
          אנו מתחייבים להגן על המידע הפרטי שלך מפני גישה לא מורשית או שימוש
          לרעה.
        </li>
        <br />
        <li>
          אסור להעתיק, לשכפל או להשתמש בתכנים מהאתר ללא אישור כתוב מהנהלת האתר.
        </li>
        <br />
        <li>
          נשמר לנו הזכות לפעול משפטית נגד כל עבירה על זכויות היוצרים שלנו.
        </li>
        <br />
        <li>
          באמצעות החיבור לחשבונך, הנך מסכים לאפשר לנו לגשת למידע בחשבון המקושר
          בהתאם לתנאי השימוש שלנו.
        </li>
        <br />
        <li>
          כל משתמש מסכים שהשימוש באתר ובשירותים המסופקים הוא על אחריותו הבלעדית.
        </li>
        <br />
        <li>אנו שומרים לנו את הזכות לשנות את התקנון ללא הודעה מוקדמת. </li>
        <br />
        <li>
          על כל משתמש לקרוא ולהסכים לתנאי השימוש והתקנון לפני השימוש בשירותים של
          האתר. על ידי שימוש בשירותים שלנו, המשתמש מצהיר שהוא מסכים לתנאים
          ולהגבלות המפורטות בתקנון זה.
        </li>
      </ul>
    </Aux>
  );
};

export default withClass(TermsComponent, classes.TermsComponent);