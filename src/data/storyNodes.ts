export type StoryNodeId = string | number;

export interface Choice {
    text: string;
    nextNodeId: StoryNodeId;
    type?: 'default' | 'danger' | 'success';
}

export interface StoryNode {
    id: StoryNodeId;
    text: string;
    choices: Choice[];
    bgImage?: string;
    bgStyle?: React.CSSProperties;
    isDefeat?: boolean; // New flag for bad endings
}

export const storyNodes: Record<string, StoryNode> = {
    "1": {
        id: 1,
        text: "父親去抓狐狸精，阿良去附近搜尋有沒有狐狸精的小孩，之後便遇到了小嫣。",
        bgImage: "style_unified_village.png",
        choices: [
            { text: "通報父親說還有餘孽", nextNodeId: "1A" },
            { text: "裝作沒看到直接放她走", nextNodeId: "1B" }
        ]
    },
    "1A": {
        id: "1A",
        text: "小嫣解釋她母親才是被誤會的那個，是那個男人不讓她走。後來阿良的父親放小嫣走了。",
        bgImage: "style_unified_village.png",
        choices: [
            { text: "繼續", nextNodeId: 2 }
        ]
    },
    "1B": {
        id: "1B",
        text: "小嫣跟阿良解釋她的母親才是被誤會的那個，那個男人不讓她走。",
        bgImage: "style_unified_village.png",
        choices: [
            { text: "繼續", nextNodeId: 2 }
        ]
    },
    "2": {
        id: 2,
        text: "之後阿良與小嫣漸漸熟悉了起來，他們發現官吏跟洋人在商討鐵路的發展，這會破壞環境與山河。",
        bgImage: "style_unified_railroad.png",
        choices: [
            { text: "選擇阻止他們", nextNodeId: "2A" },
            { text: "選擇漠視這種發展", nextNodeId: "2B" }
        ]
    },
    "2A": {
        id: "2A",
        text: "官吏為了不被他們散播這段談話，把他們關了起來，從此在牢獄裡度過...",
        bgImage: "style_unified_railroad.png",
        isDefeat: true,
        choices: [
            { text: "重新開始", nextNodeId: "start" }
        ]
    },
    "2B": {
        id: "2B",
        text: "之後山河被鐵路破壞，環境變化很大，然後他們發現那些法力也漸漸消失了。",
        bgImage: "style_unified_railroad.png",
        choices: [
            { text: "繼續", nextNodeId: 3 }
        ]
    },
    "3": {
        id: 3,
        text: "因為法力漸漸消失，阿良跟父親接不到抓妖的生意，父親接受不了這樣的事實選擇上吊。阿良因此對未來感到很迷茫。",
        bgImage: "style_unified_village.png",
        choices: [
            { text: "繼續待在鄉村做狩妖人的工作", nextNodeId: "3A" },
            { text: "離開鄉村。前往大城市工作", nextNodeId: "3B" }
        ]
    },
    "3A": {
        id: "3A",
        text: "因為賺不到錢，生活也過不下去，選擇用脖子跟房梁來一場拔河...",
        bgImage: "style_unified_village.png",
        isDefeat: true,
        choices: [
            { text: "重新開始", nextNodeId: "start" }
        ]
    },
    "3B": {
        id: "3B",
        text: "到大城市後做了工人，生活很苦，但跟之前比還算活得下去。",
        bgImage: "style_unified_city_slums.png",
        choices: [
            { text: "繼續", nextNodeId: 4 }
        ]
    },
    "4": {
        id: 4,
        text: "過了幾年，遇到了小嫣，那時的她是個娼婦，正在被人騷擾，阿良上去解圍後，他們聊起了現在這個充滿著鐵路與蒸汽的時代，並討論對未來有什麼打算。",
        bgImage: "style_unified_city_slums.png",
        choices: [
            { text: "選擇開始學習新的技術", nextNodeId: "4A" },
            { text: "繼續原本像個齒輪一樣，日復一日的生活", nextNodeId: "4B" }
        ]
    },
    "4A": {
        id: "4A",
        text: "發明新的想法後，被外國的工程師重用。生活開始變好。",
        bgImage: "style_unified_city_slums.png",
        choices: [
            { text: "繼續", nextNodeId: 5 }
        ]
    },
    "4B": {
        id: "4B",
        text: "沒辦法應付現在這個隨時都會改變的時代，但還是想改變現在的生活，變上進一點。",
        bgImage: "style_unified_city_slums.png",
        choices: [
            { text: "繼續", nextNodeId: 5 }
        ]
    },
    "5": {
        id: 5,
        text: "再遇小嫣，但她因為當情婦偷了錢被通緝，然後發現她的身體被改造成了金屬軀體。",
        bgImage: "style_unified_xiao_yan_cyborg.png",
        choices: [
            { text: "選擇了解真相", nextNodeId: "5A" },
            { text: "不去插手，因為不想讓現在的生活受影響", nextNodeId: "5B" }
        ]
    },
    "5A": {
        id: "5A",
        text: "小嫣是因為當情婦後，被那個人下藥後改造成了現在的金屬軀體。阿良清楚後要幫她恢復原狀。但小嫣想要繼續改造，成為真正的金屬人。",
        bgImage: "style_unified_xiao_yan_cyborg.png",
        choices: [
            { text: "繼續", nextNodeId: 6 }
        ]
    },
    "5B": {
        id: "5B",
        text: "阿良與小嫣分道揚鑣，但小嫣終究還是躲不住被抓到...",
        bgImage: "style_unified_city_slums.png",
        isDefeat: true,
        choices: [
            { text: "重新開始", nextNodeId: "start" }
        ]
    },
    "6": {
        id: 6,
        text: "後續他們拿那筆錢與阿良技術繼續改造，後面小嫣也解釋了為什麼要改造，因為那古老的法力回來了，不再是毛皮與血肉，而是金屬與火。之後小嫣提議要幫那些過去也是妖怪的人也改造成這樣。",
        bgImage: "style_unified_xiao_yan_cyborg.png",
        choices: [
            { text: "認同這想法", nextNodeId: "6A" },
            { text: "不認同這想法", nextNodeId: "6B" }
        ]
    },
    "6A": {
        id: "6A",
        text: "阿良陸陸續續幫那些妖都改造成了金屬軀體，與他們奔向原本那個和過去一樣充滿法力的未來。並重新做回了狩妖士，開始狩獵。\n(結局: 金屬狩獵者)",
        bgImage: "style_unified_metal_army.png",
        bgStyle: { filter: "saturate(1.5) contrast(1.2) brightness(1.1)" }, // Epic Ending
        choices: [
            { text: "重新開始", nextNodeId: "start" }
        ]
    },
    "6B": {
        id: "6B",
        text: "阿良因為在這過程喜歡上了小嫣，不想要她離開自己，而且也不想讓這個技術讓其他人也享受到，也怕別人發現後利用小嫣，並將她軟禁起來。\n(結局: 獨佔的愛)",
        bgImage: "style_unified_lonely_couple.png",
        bgStyle: { filter: "sepia(0.8) hue-rotate(-30deg) contrast(1.2)" }, // Tragic Romance (Gold/Red)
        choices: [
            { text: "重新開始", nextNodeId: "start" }
        ]
    },
    "game-over": {
        id: "game-over",
        text: "故事結束...",
        bgImage: "style_unified_village.png",
        choices: [
            { text: "重新開始", nextNodeId: "start" }
        ]
    }
};
