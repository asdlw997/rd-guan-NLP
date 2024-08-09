import KnowledgeGraph from "./KnowledgeGraph.js"
import Dictionary from "./Dictionary.js"
export default class AddTriadList {
    constructor() {
        this.input = []//0 三元组表 1 词典领域
        this.output = []//0 module 1 词典领域
        this.dictionary = new Dictionary()
        this.knowledgeGraph = new KnowledgeGraph()
    }
    run() {
        this.dictionary.fromDomain(this.input[1]);
        this.input[0].map((Triad) => {
            this.knowledgeGraph.addTriad(...Triad)
        })
        this.output[0] = this.knowledgeGraph.toModule()
        this.output[1] = this.dictionary.toDomain()
    }
}