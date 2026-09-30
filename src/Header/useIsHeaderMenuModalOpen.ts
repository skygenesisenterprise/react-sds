import { useContext } from "react";
import { HeaderMenuContext } from "./Header";

/**
 * Whether the collapsed menu of the closest `<Header />` is open.
 *
 * The header renders its mobile menu itself (no DSFR modal anymore), so the open state
 * is read from `HeaderMenuContext`. When called outside a header tree it returns `false`.
 */
export function useIsHeaderMenuModalOpen(): boolean {
    const context = useContext(HeaderMenuContext);

    return context?.isOpen ?? false;
}
