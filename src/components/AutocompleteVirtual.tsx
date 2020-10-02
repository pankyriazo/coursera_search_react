import React from "react";
import { ListChildComponentProps, VariableSizeList } from "react-window";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete, {
    AutocompleteRenderGroupParams,
    AutocompleteChangeReason,
    AutocompleteChangeDetails,
} from "@material-ui/lab/Autocomplete";
import Input from "./Input";

type InputAutocompleteVirtualProps = {
    data: string[];
    onChange: (
        event: React.ChangeEvent<{}>,
        value: unknown,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<unknown> | undefined
    ) => void;
};

const ITEM_SIZE = 32;
const LISTBOX_PADDING = 8;

const renderRow = (props: ListChildComponentProps) => {
    const { data, index, style } = props;
    return React.cloneElement(data[index], {
        style: {
            ...style,
            display: "block",
            lineHeight: "1.5",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            top: (style.top as number) + LISTBOX_PADDING,
            fontFamily: "inherit",
            fontSize: "0.8rem",
            minHeight: `${ITEM_SIZE}px`,
        },
    });
};
const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

const useResetCache = (data: any) => {
    const ref = React.useRef<VariableSizeList>(null);
    React.useEffect(() => {
        if (ref.current != null) ref.current.resetAfterIndex(0, true);
    }, [data]);
    return ref;
};

const ListboxComponent = React.forwardRef<HTMLDivElement>(
    function ListboxComponent(props, ref) {
        const { children, ...other } = props;
        const itemData = React.Children.toArray(children);
        const getHeight = () => ITEM_SIZE * itemData.length;
        const gridRef = useResetCache(itemData.length);

        return (
            <div ref={ref}>
                <OuterElementContext.Provider value={other}>
                    <VariableSizeList
                        itemData={itemData}
                        height={getHeight() + 2 * LISTBOX_PADDING}
                        width="100%"
                        ref={gridRef}
                        outerElementType={OuterElementType}
                        innerElementType="ul"
                        itemSize={() => ITEM_SIZE}
                        overscanCount={5}
                        itemCount={itemData.length}
                    >
                        {renderRow}
                    </VariableSizeList>
                </OuterElementContext.Provider>
            </div>
        );
    }
);

const renderGroup = (params: AutocompleteRenderGroupParams) => [
    params.children,
];

const useStyles = makeStyles({
    listbox: {
        boxSizing: "border-box",
        "& ul": {
            padding: 0,
            margin: 0,
        },
    },
});

const InputAutocompleteVirtual = (props: InputAutocompleteVirtualProps) => (
    <Autocomplete
        multiple
        disableListWrap
        classes={useStyles()}
        ListboxComponent={
            ListboxComponent as React.ComponentType<
                React.HTMLAttributes<HTMLElement>
            >
        }
        onChange={props.onChange}
        renderGroup={renderGroup}
        options={props.data}
        renderInput={(params) => <Input {...params} type="text" />}
    />
);

export default InputAutocompleteVirtual;
