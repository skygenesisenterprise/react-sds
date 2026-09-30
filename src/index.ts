/**
 * Root entry of @skygenesisenterprise/react-sds.
 *
 * The library is tree-shakable: importing a component from the root entry only pulls the
 * modules you actually use. For maximum granularity (and smallest bundles) you can also
 * import any component from its dedicated subpath, e.g.
 *
 *     import { Button } from "@skygenesisenterprise/react-sds/Button";
 *
 * Modules that require optional dependencies (MUI layer, charts backed by
 * @gouvfr/dsfr-chart, Next.js integration helpers…) are intentionally NOT re-exported
 * here so that importing the root entry never pulls an optional dependency.
 */

// Design tokens and helpers (fr namespace is the legacy layer, renamed with the SDS CSS).
export * from "./fr";

// SDS foundations (Sky Genesis Enterprise Design System tokens) and component families
// (layout primitives, typography, government portal and content).
export * from "./sds";

// Components — one module per component.
export { Accordion } from "./Accordion";
export { Alert } from "./Alert";
export { BackToTop } from "./BackToTop";
export { Badge } from "./Badge";
export { Breadcrumb } from "./Breadcrumb";
export { ButtonsGroup } from "./ButtonsGroup";
export { Button } from "./Button";
export { CallOut } from "./CallOut";
export { Card } from "./Card";
export { Checkbox } from "./Checkbox";
export { Download } from "./Download";
export { Follow } from "./Follow";
export { Footer } from "./Footer";
export { Header } from "./Header";
export { Highlight } from "./Highlight";
export { Input } from "./Input";
export { LanguageSelect } from "./LanguageSelect";
export { MainNavigation } from "./MainNavigation";
export { createModal } from "./Modal";
export { useIsModalOpen } from "./Modal/useIsModalOpen";
export { Notice } from "./Notice";
export { Pagination } from "./Pagination";
export { Quote } from "./Quote";
export { RadioButtons } from "./RadioButtons";
export { Range } from "./Range";
export { SearchBar } from "./SearchBar";
export { SegmentedControl } from "./SegmentedControl";
export { Select } from "./Select";
export { SideMenu } from "./SideMenu";
export { SkipLinks } from "./SkipLinks";
export { Stepper } from "./Stepper";
export { Summary } from "./Summary";
export { Table } from "./Table";
export { Tabs } from "./Tabs";
export { Tag } from "./Tag";
export { TagsGroup } from "./TagsGroup";
export { Tile } from "./Tile";
export { ToggleSwitch } from "./ToggleSwitch";
export { ToggleSwitchGroup } from "./ToggleSwitchGroup";
export { Tooltip } from "./Tooltip";
export { Upload } from "./Upload";
