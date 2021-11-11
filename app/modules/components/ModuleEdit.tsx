import { useQuery, useMutation, Link } from "blitz"
import { Wax } from "wax-prosemirror-core"
import { Popover, Transition } from "@headlessui/react"
import { ChevronDoubleDownIcon } from "@heroicons/react/solid"
import { Fragment, useState, useRef } from "react"
import { DefaultSchema } from "wax-prosemirror-utilities"
import moment from "moment"
import algoliasearch from "algoliasearch"
import { getAlgoliaResults } from "@algolia/autocomplete-js"
import { Toaster, toast } from "react-hot-toast"
import { DragDropContext, Droppable, DroppableProvided } from "react-beautiful-dnd"
import { DocumentPdf32, TrashCan32, Download32 } from "@carbon/icons-react"
import { Widget } from "@uploadcare/react-widget"
import { Prisma } from "prisma"

import addAuthor from "../mutations/addAuthor"
import AuthorList from "../../core/components/AuthorList"
import updateAuthorRank from "../../authorship/mutations/updateAuthorRank"
import getSignature from "../../auth/queries/getSignature"
import addMain from "../mutations/addMain"
import EditMainFile from "./EditMainFile"
import ManageAuthors from "./ManageAuthors"

import "@algolia/autocomplete-theme-classic"

import ReadyToPublishModal from "../../core/modals/ReadyToPublishModal"
import DeleteModuleModal from "../../core/modals/DeleteModuleModal"
import useCurrentModule from "../queries/useCurrentModule"
import InstaLayout from "../../wax/InstaLayout"
import changeTitle from "../mutations/changeTitle"
import changeAbstract from "../mutations/changeAbstract"
import Autocomplete from "../../core/components/Autocomplete"

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_SEARCH_KEY!)

const ModuleEdit = ({ user, module, isAuthor }) => {
  const [manageAuthorsOpen, setManageAuthorsOpen] = useState(false)
  // const widgetApiSupporting = useRef()
  const [moduleEdit, { refetch, setQueryData }] = useQuery(
    useCurrentModule,
    { suffix: module.suffix },
    { refetchOnWindowFocus: true }
  )
  const [authorState, setAuthorState] = useState(moduleEdit!.authors)
  const [changeTitleMutation] = useMutation(changeTitle)
  const [changeAbstractMutation] = useMutation(changeAbstract)
  const [addAuthorMutation] = useMutation(addAuthor)
  const [updateAuthorRankMutation] = useMutation(updateAuthorRank)

  console.log(moduleEdit)
  const mainFile = moduleEdit!.main as Prisma.JsonObject

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster />
      {/* Menu bar */}
      <div className="w-full bg-gray-300 flex">
        <div className="flex-grow"></div>
        <DocumentPdf32 />
        <DeleteModuleModal module={module} />
      </div>
      {/* Last updated */}
      <div className="text-center">
        Last updated: {moment(moduleEdit?.updatedAt).fromNow()} (
        {moduleEdit?.updatedAt.toISOString()})
      </div>
      {/* Parents */}
      <div className="flex w-full">
        Follows from: <Autocomplete />
      </div>
      {/* Metadata */}
      <div className="w-full">
        <p>{moduleEdit!.type}</p>
        <h1 className="min-h-16">{moduleEdit!.title}</h1>
      </div>
      {/* Authors */}
      <div className="flex border-t-2 border-b-2 border-gray-800">
        <div className="flex-grow flex -space-x-2 relative z-0 overflow-hidden">
          {moduleEdit?.authors.map((author) => (
            <img
              key={author.id + author.workspace!.handle}
              alt={`Avatar of ${author.workspace!.handle}`}
              className="relative z-30 inline-block h-8 w-8 rounded-full"
              src={author.workspace?.avatar!}
            />
          ))}
        </div>
        <ManageAuthors
          open={manageAuthorsOpen}
          setOpen={setManageAuthorsOpen}
          moduleEdit={moduleEdit}
          setQueryData={setQueryData}
        />
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            setManageAuthorsOpen(true)
          }}
        >
          Manage authors
        </button>
      </div>
      {/* Description */}
      <div>{moduleEdit!.description}</div>
      {/* Main file */}
      <div>
        <h2>Main file</h2>
        <EditMainFile mainFile={mainFile} setQueryData={setQueryData} moduleEdit={moduleEdit} />
      </div>

      {/* {JSON.stringify(mainFile)} */}
      {/* Supporting files */}
      {/* <div>
        <h2>Supporting file(s)</h2>
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            widgetApiSupporting.current.openDialog()
          }}
        >
          Upload supporting files
        </button>

        <Widget
          publicKey={process.env.UPLOADCARE_PUBLIC_KEY ?? ""}
          secureSignature={uploadSecret.signature}
          secureExpire={uploadSecret.expire}
          // value="8fd6d947-4d03-4114-8054-c0ee7b3bda03~4"
          ref={widgetApiSupporting}
          previewStep
          multiple
          multipleMax={10}
          clearable
          onChange={async (info) => {
            console.log(info)
            try {
              // TODO: Only store upon save
              // await addSupportingMutation({ suffix: moduleEdit?.suffix, json: info })
              //  TODO: add action
            } catch (err) {
              alert(err)
            }
            console.log("Upload completed:", info)
          }}
        />
      </div> */}
      {/* References */}
      {/* License */}
      <div>
        License:{" "}
        <Link href={moduleEdit!.license!.url}>
          <a target="_blank">{moduleEdit!.license!.name}</a>
        </Link>
      </div>

      {/* Old code */}
      <div className="flex justify-center items-center">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`${open ? "" : "text-opacity-90"}
                text-black group bg-orange-700 px-3 py-2 rounded-md inline-flex items-center text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <h1 className="text-8xl font-black">{moduleEdit!.title!}</h1>
                <ChevronDoubleDownIcon
                  className={`${open ? "" : "text-opacity-70"}
                  ml-2 h-5 w-5 text-white group-hover:text-opacity-80 bg-black transition ease-in-out duration-150`}
                  aria-hidden="true"
                />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                      <Wax
                        autoFocus
                        placeholder={moduleEdit!.title!}
                        value={moduleEdit!.title!}
                        config={{
                          SchemaService: DefaultSchema,
                          services: [],
                        }}
                        layout={InstaLayout}
                        onChange={async (source) => {
                          const updatedModule = await changeTitleMutation({
                            suffix: moduleEdit!.suffix,
                            title: source.replace(/<\/?[^>]+(>|$)/g, ""),
                          })
                          // refetch()
                          setQueryData(updatedModule!)
                        }}
                      />
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>

      <div>
        <h2 className="text-4xl font-black">Abstract</h2>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`${open ? "" : "text-opacity-90"}
                group bg-orange-700 rounded-md inline-flex items-center hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <p>{moduleEdit!.description!}</p>
                <ChevronDoubleDownIcon
                  className={`${open ? "" : "text-opacity-70"}
                  ml-2 h-5 w-5 text-white group-hover:text-opacity-80 bg-black transition ease-in-out duration-150`}
                  aria-hidden="true"
                />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                      <Wax
                        autoFocus
                        placeholder={moduleEdit!.description!}
                        value={moduleEdit!.description!}
                        config={{
                          SchemaService: DefaultSchema,
                          services: [],
                        }}
                        layout={InstaLayout}
                        onChange={async (source) => {
                          // TODO: Add instant edit
                          const updatedModule = await changeAbstractMutation({
                            suffix: moduleEdit!.suffix,
                            title: source.replace(/<\/?[^>]+(>|$)/g, ""),
                          })
                          // refetch()
                          console.log(updatedModule)
                          setQueryData(updatedModule)
                        }}
                      />
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>

      {/* <div>{JSON.stringify(module)}</div>
      {isAuthor && !module.published && user.emailIsVerified ? (
        <ReadyToPublishModal module={module} />
      ) : (
        ""
      )}
       */}
    </div>
  )
}

export default ModuleEdit
