import KnowledgeGraph from "./KnowledgeGraph.js"
export default class LogicDetection {
    constructor() {
        this.input = []//0 KnowledgeGraph知识图谱   1 scenes   2 word
        this.output = []//1 结果
        this.knowledgeGraph = new KnowledgeGraph()
    }
    run() {
        this.knowledgeGraph = this.input[0]
        let scenes = this.input[1]
        let word = this.input[2]
        
        this.output[0] = this.isExist3Dimensions(scenes, word);
    }
    isExist3Dimensions(scenes,word) {
        let triads = this.knowledgeGraph.filter1(scenes, word);
        if (triads.length === 3) {
            return true
        }
        return false
    }
}