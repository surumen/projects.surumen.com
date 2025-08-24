// import widget/custom components from projects folder
import ProjectPreview from './projects/ProjectPreview';
import ProjectHeader from './projects/ProjectHeader';
import Markdown from './projects/Markdown';

// import widget/custom components from navbars folder
import Sidebar from './navbars/Sidebar';
import QuickMenu from './navbars/QuickMenu';
import NavbarTop from './navbars/NavbarTop';
import SidebarToggle from './navbars/SidebarToggle';

// import navigation components
import { AdminNavigation, AdminSearch, UserMenu, YearDisplay, PortfolioNavbar } from './navigation';

// import bracket components
import Bracket from './brackets/Bracket';
import Region from './brackets/Region';
import Round from './brackets/Round';
import Game from './brackets/Game';
import Team from './brackets/Team';
import Connector from './brackets/Connector';
import Final from './brackets/FinalRegion';

// import chart components
import RacingBarChart from './charts/BarChart';

// import football components
import PlayerFormation from './football/PlayerFormation';
import Pitch from './football/Pitch';

// import form components
import { SmartForm, FormIcons } from './forms';

// import modern form components
import { Form, Field, FieldGroup, InputGroup, InputGroupPrefix, InputGroupSuffix, validationRules, asyncValidationRules } from './modern-forms';

// import table components
import { SmartTable } from './tables';

// import theme components  
import { ThemeProvider } from './theme';

// import general components
import TabPane from './components/TabPane';
import Pagination from './components/Pagination';
import LogoIcon from './components/LogoIcon';

export {
   // Projects
   ProjectPreview,
   ProjectHeader,
   Markdown,
   
   // Navigation
   Sidebar,
   QuickMenu,
   NavbarTop,
   SidebarToggle,
   AdminNavigation,
   AdminSearch,
   UserMenu,
   YearDisplay,
   PortfolioNavbar,
   
   // Charts
   RacingBarChart,
   
   // Football
   PlayerFormation,
   Pitch,
   
   // Forms
   SmartForm,
   FormIcons,
   
   // Modern Forms (Phase 1, 2 & 3)
   Form,
   Field,
   FieldGroup,
   InputGroup,
   InputGroupPrefix,
   InputGroupSuffix,
   
   // Modern Forms Validation
   validationRules,
   asyncValidationRules,
   
   // Tables
   SmartTable,
   
   // Theme
   ThemeProvider,
   
   // Brackets
   Region,
   Bracket,
   Round,
   Game,
   Team,
   Connector,
   Final,
   
   // Components
   TabPane,
   Pagination,
   LogoIcon
};
