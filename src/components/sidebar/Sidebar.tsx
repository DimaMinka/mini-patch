import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShapeSelector } from "./ShapeSelector";
import { MaterialSelector } from "./MaterialSelector";
import { SizeSelector } from "./SizeSelector";
import { ImageUploader } from "./ImageUploader";
import { ColorPicker } from "./ColorPicker";
import { usePatchStore } from "@/stores/usePatchStore";

export const Sidebar = () => {
    const dir = usePatchStore((state) => state.dir);
    const backgroundColor = usePatchStore((state) => state.backgroundColor);
    const borderColor = usePatchStore((state) => state.borderColor);
    const setBackgroundColor = usePatchStore((state) => state.setBackgroundColor);
    const setBorderColor = usePatchStore((state) => state.setBorderColor);

    return (
        <aside className="w-full lg:h-full flex flex-col lg:min-h-0 bg-background lg:overflow-hidden" dir={dir}>
            <div className="p-4 border-b">
                <h2 className="font-semibold text-lg tracking-tight text-start">Configuration</h2>
                <p className="text-sm text-muted-foreground text-start">Customize your tactical patch</p>
            </div>

            <ScrollArea className="lg:flex-1 lg:min-h-0 w-full" dir={dir}>
                <div className="p-4">
                    <Accordion type="multiple" defaultValue={['shape', 'material', 'size', 'design']} className="w-full space-y-4">

                        <AccordionItem value="shape" className="border-0">
                            <AccordionTrigger className="hover:no-underline py-2 text-md font-semibold">Shape & Dimensions</AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4 space-y-6 px-1">
                                <ShapeSelector />
                                <SizeSelector />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="material" className="border-0">
                            <AccordionTrigger className="hover:no-underline py-2 text-md font-semibold">Material & Texture</AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4 px-1">
                                <MaterialSelector />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="design" className="border-0">
                            <AccordionTrigger className="hover:no-underline py-2 text-md font-semibold">Design & Colors</AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4 space-y-6 px-1">
                                <ColorPicker
                                    label="Background Color"
                                    value={backgroundColor}
                                    onChange={setBackgroundColor}
                                />
                                <ColorPicker
                                    label="Border / Stitch Color"
                                    value={borderColor}
                                    onChange={setBorderColor}
                                />
                                <div className="pt-2 border-t">
                                    <ImageUploader />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </div>
            </ScrollArea>
        </aside>
    );
};
