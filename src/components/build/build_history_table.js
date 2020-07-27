import React, {Component} from "react";
import {Col, Modal, Row, Table, Tooltip} from "antd";
import Run_status_filter from "./run_status_filter";
import {CheckOutlined, CloseOutlined, ExpandOutlined, IssuesCloseOutlined, LinkOutlined} from "@ant-design/icons";
import Autocomplete_filter from "./autocomplete_filter";
import Datepicker_filter from "./datepicker_filter";


export default class Build_history_table extends Component{

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({data: nextProps.data});
    }

    render_single_digit_to_double_datetime(digit){
        digit = digit.toString()
        if(digit.length === 1){
            return "0" + digit;
        }
        return digit;

    }

    showBuildDescriptionModal(record){

        let key1 = "visible_modal_" + record["build_id"]
        let statevar = {}
        statevar[key1] = true;
        this.setState(statevar);
    }

    handleOkBuildDescriptionModal(record){
        let key1 = "visible_modal_" + record["build_id"]
        let statevar = {}
        statevar[key1] = false;
        this.setState(statevar);
    }

    render() {

        const columns = [

            {
                title: 'Brew Build',
                dataIndex: "build_id",
                key: "build_id",
                render: (text, record) => (

                    <div>
                        <a href={process.env.REACT_APP_BREW_BUILD_LINK+record["build_id"]}
                           target="_blank" rel="noopener noreferrer">
                            {record["build_id"] !== null && record["build_id"]}
                            {record["build_id"] === null && "Not Available"}
                        </a>
                    </div>
                )
            },
            {
                title:()=>{
                    return (
                        <Row>
                            <Col span={24} className="left">
                                Build Status
                            </Col>
                            <Col span={24}>
                                <Run_status_filter search_callback={this.props.simple_filter_callback}/>
                            </Col>
                        </Row>
                    )
                },
                dataIndex: "fault_code",
                key: "fault_code",
                render: (text, record) =>{
                    if(record["fault_code"] === "0"){
                        return(
                            <div>
                                <CheckOutlined style = {{color:  "#52c41a"}}/>
                            </div>
                        )
                    }

                    else{
                        return(
                            <div>
                                <Tooltip title={"Fault Code is " + record["fault_code"]}>
                                    <CloseOutlined style = {{color: "#f55d42"}}/>
                                </Tooltip>
                            </div>
                        )
                    }
                }
            },
            {
                title: "Brew Task",
                dataIndex: "task_id",
                key: "task_id",
                render: (data, record) => {
                    return(
                        <div>
                            <a href={process.env.REACT_APP_BREW_TASK_LINK+record["task_id"]}
                               target="_blank" rel="noopener noreferrer">{record["task_id"]}</a>
                        </div>
                    )

                }
            },
            {
                title:()=>{
                    return (
                        <Row>
                            <Col span={24} className="left">
                                Package
                            </Col>
                            <Col span={24}>
                                <Autocomplete_filter placeholder={"Package Name"} type={"nvr"} search_callback={this.props.simple_filter_callback}/>
                            </Col>
                        </Row>
                    )
                },
                dataIndex: "dg_qualified_name",
                key: "dg_qualified_name"
            },
            {
                title: "Version",
                key: "label_version",
                dataIndex: "label_version"
            },
            {
                title: "CGIT Link",
                dataIndex: "build_0_source",
                key: "build_0_source",
                render: (data, record) => {

                    const http_link = "http://pkgs.devel.redhat.com/cgit/" + record["dg_namespace"] + "/" + record["dg_name"] + "/tree/?id=" + record["dg_commit"];
                    return (
                        <a href={http_link} target="_blank" rel="noopener noreferrer">{record["dg_commit"]}</a>
                    )

                }
            },
            {
                title: "Source Commit",
                dataIndex: "build_commit_url_github",
                key: "build_commit_url_github",
                render: (data, record) => {
                    return(
                        <a href={record["build_commit_url_github"]} target="_blank" rel="noopener noreferrer"><LinkOutlined/></a>
                    )
                }
            },
            {
                title: ()=>{
                    return (
                        <Row>
                            <Col span={24} className="left">
                                Build Time ISO
                            </Col>
                            <Col span={24}>
                                <Datepicker_filter placeholder={"Build Date"} search_callback={this.props.simple_filter_callback}/>
                            </Col>
                        </Row>
                    )
                },
                dataIndex: "iso_time",
                key: "iso_time",
                render: (data, record) => {
                    //let date = new Date(record["iso_time"])
                    return (
                        <p>{record["iso_time"].split("T")[0] + " " + record["iso_time"].split("T")[1].split(".")[0]}</p>
                        // <p>{date.getFullYear()+'-' + this.render_single_digit_to_double_datetime((date.getMonth()+1)) + '-'+this.render_single_digit_to_double_datetime(date.getDate()) + ' ' + this.render_single_digit_to_double_datetime(date.getHours()) + ':' + this.render_single_digit_to_double_datetime(date.getMinutes()) + ":" + this.render_single_digit_to_double_datetime(date.getSeconds())}</p>
                    )
                }
            },
            {
                title: 'More Details',
                render: (text, record) => (
                    <div>
                        <a>
                            <ExpandOutlined  onClick={() => this.showBuildDescriptionModal(record)}/>
                        </a>
                        <Modal
                            title= {"Build Details"}
                            visible= {this.state["visible_modal_"+record["build_id"]]}
                            onOk={() => this.handleOkBuildDescriptionModal(record)}
                            onCancel={() => this.handleOkBuildDescriptionModal(record)}
                            footer={null}
                        >

                            <p><a href={record["jenkins_build_url"]}>{"Jenkins Build Url"}</a></p>
                            <p>{"Jenkins Build Number: " + record["jenkins_build_number"]}</p>
                            <p>{"Jenkins Job Name: " + record["jenkins_job_name"]}</p>
                            <p>{"Build Name: " + record["build_name"]}</p>
                            <p>{"Build Version: " + record["build_version"]}</p>

                        </Modal>
                    </div>
                )
            }

        ]

        return (
            <div>
                <Table dataSource={this.state.data} columns={columns}/>
            </div>
        );
    }

}